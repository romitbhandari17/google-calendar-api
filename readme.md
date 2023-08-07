# MVP in Node to trigger a Google Calendar Invite through Google APIs

In this Application demo, we are trying to create a Google Meeting with multiple invitees.
We also check to see if a meeting already exists for the organiser at that time, If yes, we send an alert saying: 'Meeting Exists'.

## Configuration Steps:

- First Create the credentials.json file by following the documentation: https://developers.google.com/calendar/api/quickstart/nodejs

- Get the access token by going to the URL mentioned in the console (will be asked when you execute index.js first time). Once you put the code, that code will be saved in token.json.

- Provide other details like Organiser(Calendar ID), Call Summary, Description, TimeZone, Time Zone Offset from UTC in config.js file

- Currently meeting time/day and invitees are hardcoded, these can come from some external application in a real case scenario.


## Installation

-  Clone the repository:

```
https://github.com/romitbhandari17/google-calendar-api.git
```

-  Install the required dependencies:

```
npm install
```

- Start local server with:node server.js

- In another terminal execute: node index.js


## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Implement your changes and ensure that the code passes all tests.

4. Submit a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License.