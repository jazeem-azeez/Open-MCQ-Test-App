Running the App  

    Start the Electron app: 
    ```bash
    npx electron .
    ``` 
Enter the GitHub raw URL of the markdown file and load the quiz. 
     

Explanation  

    Local Execution : The app runs entirely on the user's machine, with no backend server required.
    GitHub Integration : Users provide the raw URL of a markdown file hosted on GitHub.
    Markdown Rendering : The marked library converts markdown into HTML, ensuring proper rendering of images and videos.
    Dynamic Quiz : The app dynamically renders the quiz based on the parsed data and handles user submissions.
     

This setup provides a fully standalone Electron app that can fetch and display quizzes from GitHub [repositories](https://github.com/jazeem-azeez/Plab-Training-Question-Bank). 


Key Features of the Markdown Document  

    Subject and Minimum Score : The subject (PLAB - Obstetrics) and minimum score required to pass are clearly defined at the top.
    Questions and Options : Each question includes a description, multiple-choice options, and the correct answer marked with **Answer: X**.
    Multimedia Integration :
        Images are included using markdown syntax (![Alt Text](URL)).
        Videos are embedded using markdown links ([Video Title](URL)).
         
    Scoring : Each question has an associated score, allowing for weighted scoring.
    Clinical Scenarios : Questions are framed as clinical scenarios to simulate real-world medical decision-making.
     

How It Works in the App  

    Images and Videos : The marked library will render the markdown content, ensuring images and videos are displayed correctly in the quiz.
    Dynamic Rendering : The Electron app will parse this markdown file, extract the questions, options, and answers, and dynamically render them in the UI.
    Submission Handling : Users can select their answers, and the app will calculate their total score and determine if they passed based on the minimum score requirement.
     

This markdown document serves as a comprehensive example for your PLAB Obstetrics quiz. You can host it on GitHub or use it locally in your Electron app. 
