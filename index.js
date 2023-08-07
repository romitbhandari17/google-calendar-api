const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const config = require('./config');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';


// Load credentials from credentials.json file
fs.readFile('credentials.json', (err, content) => {
  if (err) {
    console.error('Error loading client secret file:', err);
    return;
  }
  // Authorize the client and start the main function
  authorize(JSON.parse(content), main);
});

function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials;
  console.log(client_id);
  console.log(client_secret);
  console.log(redirect_uris);
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);

  // Check if redirect_uris is defined and contains at least one element
  if (!redirect_uris || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
    console.error('Error: No valid redirect URIs provided in credentials.');
    return;
  }

  // Set the first redirect URI as the redirect URL for OAuth2
  oAuth2Client.redirectUri = redirect_uris[0];

  // Check if we have previously stored access token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getAccessToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this URL:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error while trying to retrieve access token:', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      // Store the access token to be used in future requests
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) {
          console.error('Error while storing access token:', err);
        }
        console.log('Access token stored successfully.');
        callback(oAuth2Client);
      });
    });
  });
}

// This function will check if a meeting already exists at the specified time
async function isMeetingTimeAvailable(startTime, endTime, oAuth2Client) {
    try{
        const calendar = google.calendar({ version: 'v3', auth:oAuth2Client });
        const events = await calendar.events.list({
            calendarId: config.CALENDAR_ID,
            timeMin: startTime+config.TIME_ZONE_UTC_OFFSET,
            timeMax: endTime+config.TIME_ZONE_UTC_OFFSET,
            singleEvents: true,
            orderBy: 'startTime',
        });

        console.log("Events data=",events.data.items);
    
        if (events.data.items && events.data.items.length > 0) {
            console.log('A meeting already exists at the specified time.');
            return false;
        }
    
        return true;
    } catch (err) {
        console.error('isMeetingTimeAvailable Error:', err);
    }
}

// This function will create a new event on the calendar
async function main( oAuth2Client) {
    try{

        const startTime = '2023-08-08T18:00:00'; // Replace this with the desired start time in ISO format
        const endTime = '2023-08-08T19:00:00'; // Replace this with the desired end time in ISO format
        const summary = config.SUMMARY; // Replace this with the desired event summary
        const description = config.DESCRIPTION; // Replace this with the desired event description

        const isAvailable = await isMeetingTimeAvailable(startTime, endTime, oAuth2Client);
        if (!isAvailable) {
            console.log('This day/time is already booked. Try booking another day/time');
            return false;
        }

        const calendar = google.calendar({ version: 'v3', auth:oAuth2Client });
        const event = {
            summary,
            description,
            start: {
                dateTime: startTime,
                timeZone: config.TIME_ZONE,
            },
            end: {
                dateTime: endTime,
                timeZone: config.TIME_ZONE,
            },
            attendees: [
                { email: 'traderunnerinfo@gmail.com' },
                //{ email: 'jane@example.com' }, // Second attendee
                //{ email: 'smith@example.com' }, // Third attendee],
            ],
            conferenceData: {
                createRequest: {
                    requestId: 'uds-frwk-ggt', // Replace with a unique ID for each event
                    conferenceSolutionKey: {
                    type: 'hangoutsMeet', // Type for Google Meet conference
                    },
                },
            },
        };

        calendar.events.insert(
            {
            calendarId: config.CALENDAR_ID,
            resource: event,
            },
            (err, res) => {
            if (err) {
                console.error('Error creating event:', err);
                return false;
            }
            console.log('Event created:', res.data.htmlLink);
            return true;
            }
        );
    } catch (err) {
        console.error('Error:', err);
    }
}

//main();
