# notion2Export
 This project aims to make automate Export regarding Notion Documents. Notion is a great tool for productiviy but when it comes to exporting from a large database it becomes a hassel. There are some automation tools available for exporting the documents online, but those are paid. This tool aims to automate the process and make it easier.

 # Features

 As for the features of this tool : 
   1. Mass Exporting From Databases
   2. Github commiting to Repo
   3. Exporting based on Templates

## Mass Exporting
Databases can be shared and appended to the program, and from the entries, the PageIDs can be exported to Markdown


## Github Commit
My main reason for starting this small project was to export my documents on notion and commit them to Github Pages

## Exporting Based On Templates
Export the data in different templates

# Current Progress

As for the time being, these are the current progress made in this project : 
  1. Establishing the required modules for the project

     1.1. Input from user
     
     1.2. Adding in yargs for command based operations
     
  3. Establishing basic API for communication
     
     2.1. Gathering responses and caching them as JSON
     
     2.2. Passing in PageID and gathering the blocks for conversion
     
  3. Converting the data from the page to markdown files 
  4. Conversion of Properties
   - Can convert most data types, with exception :
      - title
      - created
   - MOST IMPORTANT, -- NEED  TO MAKE THE ACCESSANDCOVERT MORE EFFICIENT AND DYNAMIC
