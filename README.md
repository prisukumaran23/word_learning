### Contents
Contains two versions of the behavioural experiment, a single day and a two day version.
* SingleDay: experiment with learning and an immediate memory test on same day 
* TwoDays_1: first day of two-day experiment with only learning components
* TwoDays_2: second day of two-day experiment to be administered 24 hours after TwoDays_1, contains memory test

Supporting files/parameters including stimuli images, stimuli lists and phq9 survey as js files, write_data.php, and consent_external_page.html.

### Prerequisites
The experiment is coded in JavaScript and uses the [jspysch library](https://www.jspsych.org/) v6.1.0:
[Download jspsych](https://github.com/jspsych/jsPsych/releases)

### Running the experiment
Download ‘Word_learning’ folder, and move jspsych-6.1.0 into the Word_learning folder. 
Open index.html inside ‘Single_day’ and this should run the experiment on your browser. 

Please note that trying to run the experiment locally might cause a similar error to below:

`Access to XMLHttpRequest at ‘data-dir’ from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-	extension, chrome-untrusted, https.`

This is due to security feature of web browsers and will be solved by running the experiment on a web server. For more information to bypass this and run locally: 
[Error information](https://github.com/jspsych/jsPsych/discussions/606), 
[Disable same origin policy on browser](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome).

Alternately, you can comment out line: `initiate_timeline.push(consent);` which will resolve the issue of web browser trying to access a local file.  The consent page can be found and viewed here instead: Word_learning/consent_external_page.html.
