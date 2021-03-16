    // Prepilot-3 (10 Participants on prolific)
    // Rewards: 15p (green star) for high reward trials and 1p (grey star) for low reward trials

    // Create timelines 
    var timeline =[];
    var initiate_timeline = [];
    var phase1_timeline = [];
    var phase2_timeline = [];
    var phase3_timeline = [];
    var memory_timeline = []; 
    var survey_timeline = [];
    var end_timeline = [];

    // Experimental parameters 
    var TRIAL_REPETITIONS = 1; 
    var PARTICIPANT;
    var MOD;
    var WORDS=[];
    var WORDS_SHUFFLED='';
    var IMAGES=[];
    var IMAGES_SHUFFLED='';
    var HIGH_REWARD_CATEGORY;
    var CURRENT_CATEGORY;
    var SCORE = 0;
    var TOT = 0;
    var CORRECT_KEY='';
    var KEY_PRESS='';
    var SHUFFLE_IMG_WORD=[];
    var MATCH_TYPE=[];

    var randomIndexes = [];
    var Shuffled_animals1=[]; var Shuffled_animals2=[];
    var Shuffled_objects1=[]; var Shuffled_objects2=[];
    for (var i=0; i<36; i++) {
      randomIndexes[i] = i;
    }
    randomIndexes.sort(function() {return (Math.round(Math.random())-0.5);});
   
    shuffle_sameindices = function(index,stim){
      out = []
      for (var i=0; i<36; i++) {
        out[i]=(stim[index[i]])
      }
      return out
    }

    add_phase_data = function(stimuli){
        for (var i=0; i<24; i++) {stimuli[i].phase = 'Phase1';}
        for (var i=24; i<48; i++) {stimuli[i].phase = 'Phase2';}
        for (var i=48; i<72; i++) {stimuli[i].phase = 'Phase3';}
    return stimuli}

    Shuffled_animals1=shuffle_sameindices(randomIndexes,stimuli_animals1)
    Shuffled_animals2=shuffle_sameindices(randomIndexes,stimuli_animals2)
    Shuffled_objects1=shuffle_sameindices(randomIndexes,stimuli_objects1)
    Shuffled_objects2=shuffle_sameindices(randomIndexes,stimuli_objects2)

    var Stimuli_Memory_Unshuffled = [].concat(Shuffled_animals1.slice(0,12),Shuffled_objects1.slice(0,12),Shuffled_animals1.slice(12,24),Shuffled_objects1.slice(12,24),Shuffled_animals1.slice(24,),Shuffled_objects1.slice(24,));
    Stimuli_Memory_Unshuffled = add_phase_data(Stimuli_Memory_Unshuffled)
    var Stimuli_Memory = jsPsych.randomization.repeat(Stimuli_Memory_Unshuffled, 1);
    var Stimuli_Phase1 = jsPsych.randomization.repeat([].concat(Shuffled_animals1.slice(0,12),Shuffled_objects1.slice(0,12),Shuffled_animals2.slice(0,12),Shuffled_objects2.slice(0,12)),1);
    var Stimuli_Phase2 = jsPsych.randomization.repeat([].concat(Shuffled_animals1.slice(12,24),Shuffled_objects1.slice(12,24),Shuffled_animals2.slice(12,24),Shuffled_objects2.slice(12,24)),1);
    var Stimuli_Phase3 = jsPsych.randomization.repeat([].concat(Shuffled_animals1.slice(24,),Shuffled_objects1.slice(24,),Shuffled_animals2.slice(24,),Shuffled_objects2.slice(24,)),1); //add word image match tag at this point before shuffling again
    var Current_Phase;
    var REW_VAL;

    function roundNumber(number, decimals) {
        var newnumber = new Number(number+'').toFixed(parseInt(decimals));
        return parseFloat(newnumber);}

    count = 0;
    check_consecutive = function(stimuli) {
        count_cat = 0;count_word = 0;
        seq_cat = [];seq_word = [];
        for (i=0;i<47;i++){
            if (stimuli[i].category==stimuli[i+1].category){
              count_cat++;
              seq_cat.push(count_cat);} 
            else {count_cat=0;seq_cat.push(count_cat)}
            if (stimuli[i].word==stimuli[i+1].word){
              count_word++;
              seq_word.push(count_word);} 
            else {count_word=0;seq_word.push(count_word);}}
        if (seq_cat.some(el => el > 3 || seq_word.some(el => el > 0))){return false}
        else {count_cat=0;count_word=0;return true}}
    
    make_stimuli_1 = function(){
        count = 0;
        Stimuli_Phase1 = jsPsych.randomization.repeat(Stimuli_Phase1,1);
        do{Stimuli_Phase1 = jsPsych.randomization.repeat(Stimuli_Phase1,1);}
        while(check_consecutive(Stimuli_Phase1)==false);}
    
    make_stimuli_2 = function(){
        count = 0;
        Stimuli_Phase2 = jsPsych.randomization.repeat(Stimuli_Phase2,1)
        do{Stimuli_Phase2 = jsPsych.randomization.repeat(Stimuli_Phase2,1);}
        while(check_consecutive(Stimuli_Phase2)==false);}

    make_stimuli_3 = function(){
        count = 0;
        Stimuli_Phase3 = jsPsych.randomization.repeat(Stimuli_Phase3,1)
        do{Stimuli_Phase3 = jsPsych.randomization.repeat(Stimuli_Phase3,1);}
        while(check_consecutive(Stimuli_Phase3)==false);}

    make_stimuli_1(); make_stimuli_2(); make_stimuli_3();
    
    set_details = function() {
    PARTICIPANT=Math.abs(hashCode(jsPsych.data.getLastTrialData().values()[0].responses.trim()))%2}

    hashCode = function(this_id) {
        var hash = 0, i, chr;
        if (this_id.length === 0) return hash;
        for (i = 0; i < this_id.length; i++) {
          chr   = this_id.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return hash;};

    var setreward ={
        type: 'call-function',
        func: function(){
            var category = ['Animal','Object'];
            if (PARTICIPANT == 0){
              HIGH_REWARD_CATEGORY = category[0]}
            else {
              HIGH_REWARD_CATEGORY = category[1]}}}

    var welcome = {
        type: "instructions",
        pages:[
          "<p> Welcome to the word learning study.</p>"+
          "<p> Press the next button below or right arrow key to continue.</p>",
         "<p>Please read the following information to decide if you are happy to participate in this study.</p>"+
          "<p><br>This study aims to investigate how people learn new words."+
            "<p>There will be 3 phases with breaks in between. In each phase, you will be shown images and their corresponding words in Japanese."+
            "<p>Your task is to remember the word-image pairing in order to complete matching tasks.",
            "<p>In one of the phases, you can earn rewards for correct performance on trials,"+
            "<br>and the total reward you earn will be your bonus payment.</p>"+
              "<p>Following 3 phases of learning, you will be asked to complete 2 surveys about your mood.",
              "<p>The whole study will take no more than 40 minutes.</p>"+
              "You can track your progress on the progress bar at the top of the screen which will be updated after each phase of the study.",
              "</p><p>Please ensure that you are in a quiet location without distractions and that you will not be interrupted."+ 
              "</p><p>Also, please ensure you are using a desktop PC or laptop and not a tablet or a phone.",
              "</p><p>If you are happy with the information, press next to complete a consent form.</p>"],
        show_clickable_nav: true};

    // Define instructions trial 
    var instructions1 = {
        type: "instructions",
        pages:[
          "<p> Let's begin the study. </p><p><br> You will be shown an image and a corresponding word in Japanese, and you must remember these. </p>" +
          "This will be followed by a blank screen with a fixation cross to focus on.</p><p> Then you will be asked to choose the correct word to match a given image or vice versa. </p>"+
          "You will have to perform the matching as quickly as you can by:"+
          "</p><p><b>Pressing F</b> to select left or <b>Pressing J</b> to select right.",
          "</p><p>Let's try 5 practice trials first. Press next to begin."],
        show_clickable_nav: true};

    // Ensure check box in consent form is checked, otherwise alert pops up
    var check_consent = function(elem) {
    if (document.getElementById('consent_checkbox').checked) {return true;}
    else {alert("If you wish to participate, you must check the box 'I have read and understood the information provided and agree to take part in this study'.");
      return false;}
    return false;};
  
    // Consent 
    var consent = {
    type:'external-html',
    url: "consent_external_page.html",
    cont_btn: "start",
    check_fn: check_consent}; 

    // Participant ID to be entered
    var pno_block = {
    type: 'survey-text',
    questions: [{prompt:"Please enter your prolific ID. Please do not include any spaces.", name:'ParticipantID',required:true}],
    data: {trial_id: 'prolificID'},
    on_finish: function(data) {
        var mod = Math.abs(hashCode(data.responses.trim()))%2;
        var category = ['Animal','Object'];
        MOD = mod;
        if (mod == 0) {
            data.condition = 'Reward_Animals';}
        else {
            data.condition = 'Reward_Objects';}}};
    
    var age = {
        type: 'survey-text',
        data: {
          trial_id: 'subject age'},
        questions: [{prompt: "Please enter your age:", name:'Age',required:true}],
        required: true,
        horizontal: true};
    
    var gender = {
      type: 'survey-multi-choice',
      data: {
        trial_id: 'subject gender'},
      questions: [{prompt:'Sex:', name:'Sex', options:['Female','Male','Prefer not to say'],required:true}],
      required: [true]};

    var instructions2 = {
        type: "html-keyboard-response",
        stimulus: "<p>Now let's begin the real study.</p><p>Phase 1 will take no more than 10 minutes."+
        "</p><p><b>Press J</b> to begin.</p>", 
        trial_duration: 60000,
        choices: ['j'],
        data: {trial_id: 'instructions'},
        on_start: function(instructions2){
          jsPsych.setProgressBar(0.05);},
        on_finish: function(instructions2){
          Current_Phase = 'Phase 1';}};
    
    var instructions_break_1 = {
      type: "html-keyboard-response",
      stimulus: "<p>You have completed phase 1 of learning."+
      "</p><p>Now you may take a break for a few minutes (not more than 5 minutes)."+
      "</p><p><b>Press J</b> when you are ready to continue to the next phase of learning.</p>"+ 
      "</p><p><br><b>Note: </b>The study will move onto the next page automatically after 5 minutes.",
      trial_duration: 300000,
      data: {trial_id: 'instructions'},
      choices: ['j'],
      on_start: function(instructions_break_1){
        jsPsych.setProgressBar(0.25);},
      on_finish: function(instructions_break_1){
        Current_Phase = 'Phase 2';}};

    var instructions3 = {
      type: "html-keyboard-response",
      stimulus: "<p>The next phase of learning will be the same as phase 1, but you can earn rewards."+
      "</p><p>Correct performance on each trial will be rewarded with either a green star or a grey star.</p>"+
      "<div style='width: 750px;'>"+
      "<div style='float: left;'><img src='../img/greenstar.jpg' height='250px' width='250px' align='middle'></img>" +
      "<p class='small'>On green star trials you can earn <b>15p</b></p></div>" +
      "<div style='float: right;'><img src='../img/greystar.jpg' height='250px' width='250px' align='middle'></img>" +
      "<p class='small'>On grey star trials you can earn <b>1p</b></p></div>" +
      "</div>"+
      "<div class='space'></div></p><p>Phase 2 will take no more than 10 minutes."+
      "</p><p><b>Press J</b> to begin.", 
      trial_duration: 60000,
      data: {trial_id: 'instructions'},
      choices: ['j'],
      on_finish: function(instructions3){
        jsPsych.setProgressBar(0.25);
        Current_Phase = 'Phase 2';}};
    
    var instructions4 = {
      type: "html-keyboard-response",
      stimulus: "<p>The next phase is the last phase of learning, this phase will not include additional rewards."+
      "</p><p>It will take no more than 10 minutes."+
      "</p><p><b>Press J</b> to begin Phase 3.", 
      trial_duration: 60000,
      data: {trial_id: 'instructions'},
      choices: ['j'],
      on_finish: function(instructions4){
        jsPsych.setProgressBar(0.55);
        Current_Phase = 'Phase 3';}};
    
      var instructions_break_3 = {
        type: "html-keyboard-response",
        stimulus: "<p>You have completed all the phases of learning."+
        "</p><p>Now you may take a break for a few minutes (not more than 5 minutes)."+
        "</p><p><b>Press J</b> when you are ready to continue to the next part of study.</p>"+ 
        "</p><p><br><b>Note: </b>The study will move onto the next page automatically after 5 minutes.",
        trial_duration: 300000,
        data: {trial_id: 'instructions'},
        choices: ['j'],
        on_start: function(instructions_break_3){
          jsPsych.setProgressBar(0.75);},
        on_finish: function(instructions_break_3){
          Current_Phase = 'Phase 3';}};

      var instructions5 = {
        type: "html-keyboard-response",
        stimulus: "The next part of the study is a surprise memory test."+
        "</p><p>You will be shown images from the learning phases and you will have to choose the correct Japanese word."+
        "</p><p>Similar to previous matching tasks, <b>Press F</b> for left word or <b>Press J</b> for right word to choose."+
        "</p><p>After choosing a word, you will be asked to rate how confident you are of your choice."+
        "</p><p><b>Press J</b> to begin the memory test.",
        trial_duration: 60000,
        choices: ['j'],
        data: {trial_id: 'instructions'},
        on_finish: function(instructions5){
          jsPsych.setProgressBar(0.75);
          Current_Phase = 'Memory';}};

    var instructions6 = {
      type: "instructions",
      pages: [ "You have completed the all the learning and memory tests.",
      "The final part of this study will ask you to complete a survey about your mood over the past 2 weeks."],
      show_clickable_nav: true,
      on_start: function(instructions6){
        jsPsych.setProgressBar(0.90)
        Current_Phase = 'Survey';},
      data: {trial_id: 'instructions'}};

    var fixation = {
        type: 'html-keyboard-response',
        stimulus: '<p style="font-size: 80px; font-family:monospace;">+</p>',
        choices: jsPsych.NO_KEYS,
        trial_duration: 1000,
        data: {trial_id: 'fixation'}}

    var image = {
        type: 'html-keyboard-response',
        stimulus: function(){
            var html = "<div class='header' align='center' style='font-size: 45px;'><b>"+jsPsych.timelineVariable('word', true)+"</b></div>";
            html += "<div class='Row'>"+
            "<div align='center' style='font-size: 45px;'class='Column'> </div>"+
            "<div align='center' class='Column'><img src='"+jsPsych.timelineVariable('image', true)+"' height='300px' width='300px'></div>"+
            "<div align='center' style='font-size: 45px;'class='Column'> </div>"+
            "</div>"
            return html;},
        choices: jsPsych.NO_KEYS,
        data: {phase: function(){return Current_Phase},trial_id: 'stimuli', category: jsPsych.timelineVariable('category'), 
              word: jsPsych.timelineVariable('word'),matchword: jsPsych.timelineVariable('matchword')},
        trial_duration: 2000}

    check_correct_key = function(check) {
        if(check == WORDS[0] && check == WORDS_SHUFFLED[0]){return 'f';} 
        else if(check == WORDS[0] && check ==! WORDS_SHUFFLED[0]){return 'j';}
        else if(check == IMAGES_SHUFFLED[0]){return 'f';} 
        else{return 'j';}
        };
            
    letter_conversion = function(letter) {
    if(letter == 'j'){
        return 74;}
    else if (letter =='f'){
        return 70;}};

    var matchword ={
        type: 'html-keyboard-response',
        stimulus: function(){
            WORDS = [jsPsych.timelineVariable('word', true),jsPsych.timelineVariable('matchword', true)];
            WORDS_SHUFFLED = jsPsych.randomization.repeat(WORDS, 1);
            IMAGES = [jsPsych.timelineVariable('image2', true),jsPsych.timelineVariable('imagealt', true)];
            IMAGES_SHUFFLED = jsPsych.randomization.repeat(IMAGES, 1);
            check = [];   
            if(jsPsych.timelineVariable('matchtype', true)=='match_word'){
                //console.log(jsPsych.timelineVariable('matchtype', true));
                check = WORDS[0];
                var html = "<div class='header' align='center' style='font-size: 18px;'><i>Choose the correct word</i></div>";
                html += "<div class='Row'>"+
                "<div align='center' style='padding-left:200px; font-weight: bold; font-size: 45px;'class='Column'>"+WORDS_SHUFFLED[0]+"<br/><br/>"+
                "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
                "<div align='center' class='Column'><img src='"+jsPsych.timelineVariable('image2', true)+"' height='300px' width='300px'></div>"+
                "<div align='center' style='padding-right:200px; font-weight: bold; font-size: 45px;'class='Column'>"+WORDS_SHUFFLED[1]+"<br/><br/>"+
                "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
                "</div>"}
            else{check = IMAGES[0];
                //console.log(jsPsych.timelineVariable('matchtype', true));
                var html = "<div class='header' align='center' style='font-size: 18px;'><i>Choose the correct image</i></div>";
                html += "<div class='Row'>"+
                "<div align='center' style='padding-left:150px; font-weight: bold; font-size: 45px;'class='Column'><img src='"+IMAGES_SHUFFLED[0]+"' height='300px' width='300px'class='white_border'><br/><br/>"+
                "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
                "<div align='center' style='font-weight: bold; font-size: 45px;'class='Column'>"+jsPsych.timelineVariable('word', true)+"</div>"+
                "<div align='center' style='padding-right:150px; font-weight: bold; font-size: 45px;'class='Column'><img src='"+IMAGES_SHUFFLED[1]+"' height='300px' width='300px'class='white_border'><br/><br/>"+
                "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
                "</div>"}
            return html;},
        data: {phase: function(){return Current_Phase},trial_id:'match',trial_matchtype:jsPsych.timelineVariable('matchtype'),category: jsPsych.timelineVariable('category'),
            word: jsPsych.timelineVariable('word'), 
            matchword: jsPsych.timelineVariable('matchword'),imagealt: jsPsych.timelineVariable('imagealt')},
        on_finish: function(data){
            var correct_letter = letter_conversion(check_correct_key(check))
            data.correct_key = correct_letter
            CORRECT_KEY = correct_letter
            KEY_PRESS = data.key_press
            if(data.key_press == correct_letter){
                data.correct = true;
            }else{
                data.correct = false;}},
        choices: ['f','j'],
        trial_duration: 2000}

        var match_memory ={
          type: 'html-keyboard-response',
          stimulus: function(){
              WORDS = [jsPsych.timelineVariable('word', true),jsPsych.timelineVariable('matchword', true)];
              WORDS_SHUFFLED = jsPsych.randomization.repeat(WORDS, 1);
              check = WORDS[0];
                var html = "<div class='header' align='center' style='font-size: 18px;'><i>Choose the correct word</i></div>";
                html += "<div class='Row'>"+
                "<div align='center' style='padding-left:200px; font-weight: bold; font-size: 45px;'class='Column'>"+WORDS_SHUFFLED[0]+"<br/><br/>"+
                "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
                "<div align='center' class='Column'><img src='"+jsPsych.timelineVariable('image', true)+"' height='300px' width='300px'></div>"+
                "<div align='center' style='padding-right:200px; font-weight: bold; font-size: 45px;'class='Column'>"+WORDS_SHUFFLED[1]+"<br/><br/>"+
                "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
                "</div>"+
                "<div class='header_mem' align='center' style='font-size: 18px;'><i> </i></div>";
              return html;},
          data: {phase: function(){return Current_Phase},trial_id:'match_memory',trial_matchtype:jsPsych.timelineVariable('matchtype'),category: jsPsych.timelineVariable('category'),
              word: jsPsych.timelineVariable('word'), word_phase: jsPsych.timelineVariable('phase'), 
              matchword: jsPsych.timelineVariable('matchword'),imagealt: jsPsych.timelineVariable('imagealt')},
          on_finish: function(data){
              var correct_letter = letter_conversion(check_correct_key(check))
              data.correct_key = correct_letter
              CORRECT_KEY = correct_letter
              KEY_PRESS = data.key_press
              if(data.key_press == correct_letter){
                  data.correct = true;
              }else{
                  data.correct = false;}},
          choices: ['f','j'],
          trial_duration: 5000}
        
        var memory_certainty = {
            type: 'html-slider-response',
            stimulus: function(){
                if(KEY_PRESS == '70'){
                    var html = "<div style='font-size: 20px;'<p>How confident are you of your choice?</p></div>";
                    html += "<div class='Row'>"+
                    "<div align='center' style='padding-left:200px; font-weight: bold; font-size: 45px;'class='Column'><u>"+WORDS_SHUFFLED[0]+"</u><br/><br/>"+
                    "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
                    "<div align='center' class='Column'><img src='"+jsPsych.timelineVariable('image', true)+"' height='300px' width='300px'></div>"+
                    "<div align='center' style='padding-right:200px; font-weight: bold; font-size: 45px;'class='Column'>"+WORDS_SHUFFLED[1]+"<br/><br/>"+
                    "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
                    "</div>"
                    return html;}
                else if (KEY_PRESS == '74'){
                    var html = "<div style='font-size: 20px;'<p>How confident are you of your choice?</p></div>";
                    html += "<div class='Row'>"+
                    "<div align='center' style='padding-left:200px; font-weight: bold; font-size: 45px;'class='Column'>"+WORDS_SHUFFLED[0]+"<br/><br/>"+
                    "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
                    "<div align='center' class='Column'><img src='"+jsPsych.timelineVariable('image', true)+"' height='300px' width='300px'></div>"+
                    "<div align='center' style='padding-right:200px; font-weight: bold; font-size: 45px;'class='Column'><u>"+WORDS_SHUFFLED[1]+"</u><br/><br/>"+
                    "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
                    "</div>"
                    return html;}},
            labels: ['Guess','Completely certain'],
            data: {phase: function(){return Current_Phase}, trial_id: 'memory_certainty'},
            require_movement: true,
            step: 10,
            slider_width: 600}
        
        var memory_feedback_slow = {
          type: 'html-keyboard-response',
          stimulus: function(){
          var html = "<div class='header' align='center' style='font-size: 30px;color: black;'><b>Too Slow!</b></div>";
          return html},
        choices: jsPsych.NO_KEYS,
        data: {phase: function(){return Current_Phase},trial_id: 'memory_feedback', category: jsPsych.timelineVariable('category'),
            word: jsPsych.timelineVariable('word'), word_phase: jsPsych.timelineVariable('phase'), 
            matchword: jsPsych.timelineVariable('matchword')},
        trial_duration: 1200}

        var if_node1 = {
            timeline: [memory_certainty],
            conditional_function: function(){
                if (KEY_PRESS == '70' || KEY_PRESS == '74'){return true;}
                else {return false;}
            }
        }
        var if_node2 = {
            timeline: [memory_feedback_slow],
            conditional_function: function(){
                if (KEY_PRESS == '70' || KEY_PRESS == '74'){return false;}
                else {return true;}
            }
        }

        var feedback ={
          type: 'html-keyboard-response',
          stimulus: function(){
          //var red = '#B00000'
          //var green = '#006600'
          var red = '#d61818';
          var green = '#1f971f';
          var img = ["<div class='Row'>"+
          "<div align='center' style='padding-left:150px; font-weight: bold; font-size: 45px;'class='Column'><img src='"+IMAGES_SHUFFLED[0]+"' height='300px' width='300px'class='green_border'><br/><br/>"+
          "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
          "<div align='center' style='font-weight: bold; font-size: 45px;'class='Column'>"+jsPsych.timelineVariable('word', true)+"</div>"+
          "<div align='center' style='padding-right:150px; font-weight: bold; font-size: 45px;'class='Column'><img src='"+IMAGES_SHUFFLED[1]+"' height='300px' width='300px'class='red_border'><br/><br/>"+
          "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
          "</div>","<div class='Row'>"+
          "<div align='center' style='padding-left:150px; font-weight: bold; font-size: 45px;'class='Column'><img src='"+IMAGES_SHUFFLED[0]+"' height='300px' width='300px'class='red_border'><br/><br/>"+
          "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
          "<div align='center' style='font-weight: bold; font-size: 45px;'class='Column'>"+jsPsych.timelineVariable('word', true)+"</div>"+
          "<div align='center' style='padding-right:150px; font-weight: bold; font-size: 45px;'class='Column'><img src='"+IMAGES_SHUFFLED[1]+"' height='300px' width='300px'class='green_border'><br/><br/>"+
          "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
          "</div>"];
          var word = ["<div class='Row'>"+
          "<div align='center' style='padding-left:200px; font-weight: bold; font-size: 45px; color:"+green+";'class='Column'>"+WORDS_SHUFFLED[0]+"<br/><br/>"+
          "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
          "<div align='center' class='Column'><img src='"+jsPsych.timelineVariable('image2', true)+"' height='300px' width='300px'></div>"+
          "<div align='center' style='padding-right:200px; font-weight: bold; font-size: 45px; color:"+red+";'class='Column'>"+WORDS_SHUFFLED[1]+"<br/><br/>"+
          "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
          "</div>","<div class='Row'>"+
          "<div align='center' style='padding-left:200px; font-weight: bold; font-size: 45px; color:"+red+";'class='Column'>"+WORDS_SHUFFLED[0]+"<br/><br/>"+
          "<img src='../img/F.jpg' height='40px' width='40px'></div>"+
          "<div align='center' class='Column'><img src='"+jsPsych.timelineVariable('image2', true)+"' height='300px' width='300px'></div>"+
          "<div align='center' style='padding-right:200px; font-weight: bold; font-size: 45px; color:"+green+";'class='Column'>"+WORDS_SHUFFLED[1]+"<br/><br/>"+
          "<img src='../img/J.jpg' height='40px' width='40px'></div>"+
          "</div>"];
          var stim = [];
        if (jsPsych.timelineVariable('matchtype', true)=='match_word'){stim = word}else{stim=img}
        if(KEY_PRESS == '70'& KEY_PRESS == CORRECT_KEY){
            var html = "<div class='header' align='center' style='font-size: 30px;color: "+green+";'><b>Correct!</b></div>"+stim[0]+"";
            return html;}
        else if (KEY_PRESS == '74' & KEY_PRESS == CORRECT_KEY){
            var html = "<div class='header' align='center' style='font-size: 30px;color: "+green+";'><b>Correct!</b></div>"+stim[1]+"";
            return html;}
        else if (KEY_PRESS == '74' & KEY_PRESS != CORRECT_KEY){
            var html = "<div class='header' align='center' style='font-size: 30px;color: "+red+";'><b>Wrong!</b></div>"+stim[0]+"";
            return html;}
        else if (KEY_PRESS == '70' & KEY_PRESS != CORRECT_KEY){
            var html = "<div class='header' align='center' style='font-size:30px;color: "+red+";'><b>Wrong!</b></div>"+stim[1]+"";
            return html;}
        else if (KEY_PRESS != CORRECT_KEY){
          if (CORRECT_KEY == '70'){
            var html = "<div class='header' align='center' style='font-size: 30px;color: black;'><b>Too slow!</b></div>"+stim[0]+"";}
          else if (CORRECT_KEY == '74'){
            var html = "<div class='header' align='center' style='font-size: 30px;color: black;'><b>Too slow!</b></div>"+stim[1]+"";}
          return html}},
        choices: jsPsych.NO_KEYS,
        data: {phase: function(){return Current_Phase},trial_id: 'feedback', category: jsPsych.timelineVariable('category'),
            word: jsPsych.timelineVariable('word'), 
            matchword: jsPsych.timelineVariable('matchword')},
        trial_duration: 2000}
    
    TOTAL_SCORE='';
    set_score = function(){
      if (TOT==0){TOTAL_SCORE = "£"+(Math.round((SCORE) * 1e12) / 1e12).toFixed(2)+"";return TOTAL_SCORE}
      else {TOTAL_SCORE = "£"+(Math.round((SCORE) * 1e12) / 1e12).toFixed(2)+"";return TOTAL_SCORE}
    }

    set_outcome = function(key_press,correct_key) {
      var red = '#d61818';
      var green = '#1f971f';
      CURRENT_CATEGORY = jsPsych.data.getLastTrialData().values()[0].category;
      if(HIGH_REWARD_CATEGORY == CURRENT_CATEGORY && key_press == correct_key){
          REW_VAL = 0.15;
          //console.log(CURRENT_CATEGORY,REW_VAL)
          SCORE = Math.round((SCORE+REW_VAL) * 1e12) / 1e12;
          TOT = Math.round((TOT+REW_VAL) * 1e12) / 1e12;
            var html = "<div style='padding-top:50px; font-size: 35px; color:"+green+";'><p><b>You earned +15p</b></div>";
            html += "<div class='frame'><span class='helper'></span><img src='../img/greenstar.jpg' style='vertical-align:middle' height='240px' width='240px'></div>";
            html += "<div style='font-size: 27px;color:"+green+";'><p><b> Total bonus: "+set_score()+" </b></div>";
            return html;}
      else if(HIGH_REWARD_CATEGORY != CURRENT_CATEGORY && key_press == correct_key){ //correct but unrewarded category
        REW_VAL = 0.01;            //too slow
        //console.log(CURRENT_CATEGORY,REW_VAL)
        SCORE = Math.round((SCORE+REW_VAL) * 1e12) / 1e12;
        TOT = Math.round((TOT+REW_VAL) * 1e12) / 1e12
        var html = "<div style='padding-top:50px; font-size: 35px; color:black;'><p><b>You earned +1p</b></div>";
        html += "<div class='frame'><span class='helper'></span><img src='../img/greystar.jpg' style='vertical-align:middle' height='240px' width='240px'></div>";
        html += "<div style='font-size: 27px;color:black;'><p><b> Total bonus: "+set_score()+" </b></div>";
        return html;}
      else if(key_press == null){ 
        REW_VAL = '0';            //too slow
        //console.log('tooslow',REW_VAL)
        var html="<div style='padding-top:50px; font-size: 30px; color:"+red+";''<p><b> No reward </b></p></div>";
        html += "<div class='frame'><span class='helper'></span><img src='../img/cross.jpg' style='vertical-align:middle' height='190px' width='190px'></div>";
        html += "<div style='font-size: 27px;color:"+red+";'><p><b> Total bonus: "+set_score()+" </b></div>";
        return html;}
      else{
        REW_VAL = '0';            //wrong
        //console.log('wrong',REW_VAL)
        var html="<div style='padding-top:50px; font-size: 30px; color:"+red+";''<p><b> No reward </b></p></div>";
        html += "<div class='frame'><span class='helper'></span><img src='../img/cross.jpg' style='vertical-align:middle' height='190px' width='190px'></div>";
        html += "<div style='font-size: 27px;color:"+red+";'><p><b> Total bonus: "+set_score()+" </b></div>";
        return html;}}

    var reward ={
      type: 'html-keyboard-response',
      stimulus: function(){
          var outcome = set_outcome(KEY_PRESS,CORRECT_KEY)
          return outcome},
      data: {reward_value: function(){return REW_VAL},phase: function(){return Current_Phase},trial_id: 'reward', category: jsPsych.timelineVariable('category'),
      word: jsPsych.timelineVariable('word'), 
      matchword: jsPsych.timelineVariable('matchword')},
      choices: jsPsych.NO_KEYS,
      trial_duration: 2000}
    
    var trial = {
      timeline: [fixation, image, fixation, matchword,feedback],
      timeline_variables: stimuli_trial,
      randomize_order: false}

    var test_1 = {
      timeline: [fixation, image, fixation, matchword, feedback],
      timeline_variables: Stimuli_Phase1,
      randomize_order: false,
      repetitions: TRIAL_REPETITIONS}
    
    var test_2_reward = {
      timeline: [fixation, image, fixation, matchword, feedback, reward],
      timeline_variables: Stimuli_Phase2,    
      randomize_order: false,
      repetitions: TRIAL_REPETITIONS}

    var test_3 = {
      timeline: [fixation, image, fixation, matchword, feedback],
      timeline_variables: Stimuli_Phase3,
      randomize_order: false,
      repetitions: TRIAL_REPETITIONS}

    var memory_test = {
      timeline: [fixation, match_memory, if_node1, if_node2], 
      timeline_variables: Stimuli_Memory,
      randomize_order: true,
      repetitions: 1}

    var survey_ques = {
        type: 'html-slider-response',
        stimulus: function(){
            var html = "<div style='font-size: 16px;'<p>Over the last 2 weeks, how often have you been bothered by this problem?</p></div>"+
            "<div style='font-size:25px;'<p>"+jsPsych.timelineVariable('question',true)+"</p></div>";
            return html},
        labels: function(){return jsPsych.timelineVariable('labels',true)},
        data: {phase: function(){return Current_Phase}, trial_id: 'survey'},
        require_movement: true,
        slider_width: 700}
        
    var final_ques = {
        type: 'html-slider-response',
        stimulus: "<div style='font-size: 25px;'<p>If you have experienced any of the problems, how <b>difficult</b>"+
        "<br>have these problems made it for you to do your work, take care of things at home,"+ 
        "<br>or get along with other people?</p></div>",
        labels: ['Not difficult at all','Somewhat difficult','Very difficult','Extremely difficult'],
        slider_width: 700,
        data: {phase: function(){return Current_Phase}, trial_id: 'survey'},
        require_movement: true}

    var survey = {
        timeline: [survey_ques],
        timeline_variables: phq9,
        randomize_order: false}

    var end_info = {
      type: "instructions",
      pages:[
        "Finished! Thank you for your time :)"
      ],
      show_clickable_nav: true,
      on_start: function(instructions6){
        jsPsych.setProgressBar(1.0)},
      data: {trial_id: 'instructions'}};


    function saveData(name, data){
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({filename: name, filedata: data}));
    }

    var pilot_questions1 = {
      type: 'survey-text',
      questions: [{prompt:"Q1. Did you have any knowledge of Japanese beforehand?",required:true,rows:1,columns:80},
      {prompt:"Q2. Did you anticipate that there would be a memory test after the learning tasks?",required:true,rows:1,columns:80},
      {prompt:"Q3. What strategy did you use for the test?",required:true,rows:3,columns:80},],
      preamble: '<b> <font size ="5"> Feedback </font></b>'+
      '<p> Please answer the questions below and click continue.</p>',
      data: {trial_id: 'feedback'}
    }; 

    var pilot_questions2 = {
      type: 'survey-text',
      questions: [{prompt:"Q4. Did you notice that there were two categories of images (animals and objects)?",required:true,rows:1,columns:80},
      {prompt:"Q5. Did you notice which category was rewarded with a higher bonus?",required:true,rows:1,columns:80},
      {prompt:"Q6. Did you pay attention to the total reward you were earning?",required:true,rows:1,columns:80},
      {prompt:"Q7. Any other comments on the design and comprehensibility of the study:",rows:3,columns:80}],
      preamble: '<b> <font size ="5"> Feedback </font></b>'+
      '<p> Please answer the questions below and click continue to submit your data.</p>',
      data: {trial_id: 'feedback'}
    }; 

    var submit_prolific = {
      type: "html-keyboard-response",
      stimulus: "You have completed the study!"+
      "<p>Please click on the link below to confirm your submission to Prolific."+
      "<p><b><a href='https://app.prolific.co/submissions/complete?cc=2714E33E' target='_blank'>Click to submit</a></b>"+
      "</p><p><b>Press J</b> when submission is complete.</p>", 
      trial_duration: 60000,
      choices: ['j'],
      data: {trial_id: 'end'},
      on_finish: function(submit_prolific){
        Current_Phase = 'End';}};

    var end = {
      type: "instructions",
      pages:["Finished! Thank you for your time and taking part in this study."+
    "<p>The purpose of this study is to investigate whether people’s memories of similar stimuli can be improved in retrospect or after receiving rewards for that stimuli category."+
    "<br>To test this, you were rewarded for only stimuli category (animals or objects) during phase 2 of the experiment and not during phases 1 or 3, and later tested for memory/successful learning."+
    "<p>We also want to examine how learning and memory is affected by rewards in mood/depression disorders. Thus, the study included questionnaires asking about your mental health."+
     "<br>If you have any concerns about your mental health, please contact your GP. There are also other support networks available such as the Samaritans (UK): 116 123 (24-hour free to call helpline)."+
    "<p>If you still have questions about the study or would like to learn more, please contact Priyanka Sukumaran (ox19730@bristol.ac.uk)."],
      show_clickable_nav: true,
      on_start: function(end){
        jsPsych.setProgressBar(1.0)},
      data: {trial_id: 'end'}};
    
    var instructions_break_2 = {
      type: "html-keyboard-response",
      stimulus: function(){
      var html = "<p>You have completed phase 2 of learning.";
      html +=  "</p><style='font-size: 30px;color: #006600;'><p>Great job! You earned a <b>bonus payment of "+set_score()+".</b>"+
      "</p><p>Now you may take a break for a few minutes (not more than 5 minutes)."+
      "</p><p><b>Press J</b> when you are ready to continue to the next phase of learning.</p>"+
      "</p><p><br><b>Note: </b>The study will move onto the next page automatically after 5 minutes."; 
      return html},
      trial_duration: 300000,
      choices: ['j'],
      data: {trial_id: 'instructions'},
      on_start: function(instructions_break_2){
        jsPsych.setProgressBar(0.55);},
      on_finish: function(instructions_break_2){
        Current_Phase = 'Phase 2';}};

    // timeline containing initial info and consent forms
    initiate_timeline.push(welcome);
    initiate_timeline.push(consent);
    initiate_timeline.push(age);
    initiate_timeline.push(gender);
    initiate_timeline.push(pno_block);
    initiate_timeline.push({
    type: 'call-function',
    func: function(){
      set_details();} // calls set_details function immediately after participant ID given
    });
    initiate_timeline.push({
      type: 'fullscreen',
      fullscreen_mode: true
    });
    initiate_timeline.push(instructions1);
    initiate_timeline.push(trial);
    initiate_timeline.push(setreward);

    phase1_timeline.push(instructions2);
    phase1_timeline.push(test_1);
    phase1_timeline.push(instructions_break_1);
    phase2_timeline.push(instructions3);
    phase2_timeline.push(test_2_reward);
    phase2_timeline.push(instructions_break_2);
    phase2_timeline.push(instructions4);
    phase3_timeline.push(test_3);
    phase3_timeline.push(instructions_break_3);

    memory_timeline.push(instructions5);
    memory_timeline.push(memory_test);
    memory_timeline.push(instructions6);
    survey_timeline.push(survey);
    survey_timeline.push(final_ques);

    end_timeline.push(pilot_questions1);
    end_timeline.push(pilot_questions2);
    end_timeline.push({
      type: 'call-function',
      func: function(){
        saveData("RL_1Day", jsPsych.data.get().csv());
      }
      });
    end_timeline.push(submit_prolific);
    end_timeline.push({
      type: 'fullscreen',
      fullscreen_mode: false
    });
    end_timeline.push(end);

  var initiate = {timeline: initiate_timeline}
  var phase1 = {timeline: phase1_timeline}
  var phase2 = {timeline: phase2_timeline}
  var phase3 = {timeline: phase3_timeline}
  var memory = {timeline: memory_timeline}
  var survey = {timeline: survey_timeline}
  var end = {timeline: end_timeline}

  // Pushing all timelines onto main timeline
  timeline.push(initiate,phase1,phase2,phase3,memory,survey,end)

  // Start the experiment 
  jsPsych.init({
      timeline: timeline,
      show_progress_bar: true,
      auto_update_progress_bar: false,
      preload_images: preload_imgs,
      //on_finish: function(){jsPsych.data.displayData('json')}
      }); 