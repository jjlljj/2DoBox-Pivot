# 2DoBox-pivot

This is an assignment for Turing School's Mod 1 Front End program. We were given another group's repo from a previous 'IdeaBox' project, and had to take the foreign code code base, refactor it, and add features to create a '2Do Box'. The 2DoBox has the same layout as IdeaBox, with key features changed and added. 

## Architecture

For this project, we’ll be increasingly thinking about the “server” and “client” as separate entities. We’ll be using:
* JavaScript (with jQuery) to manage client-side interactions.
* JSON and localStorage to persist data between sessions.

## Data Model
A new 2Do card will include(id, title, task, and importance) 
* The id should be a unique identifier.
* title and task are free-form strings.
* quality should be one of the follow: critical, high, normal, low, none.
By default, the task’s "importance" should default to the middle setting of normal.


### Viewing Tasks

When visiting the application, the user should:

* See a list of all existing tasks, including the title, task, and importance for each.
* Will be able to change the importance level of the task in the card after it has been created.

### Adding a new Task

On the application’s main page, a user should:

* See two text boxes for entering the “Title” and Task for a new to-Do, and a “Save” button for committing that to-do.

### When a user clicks “Save”:

* A new to-do with the provided title and task should appear in the to-do list.
* The text fields should be cleared and ready to accept a new task.
* The page should not reload.
* The to-do should be persisted. It should still be present upon reloading the page.

### Deleting an existing task

When viewing the task list:

* Each task in the list should have a link or button to “Delete” (or 𝗫).
* Upon clicking “Delete”, the appropriate task should be removed from the list.
* The page should not reload when an task is deleted.
* The task should be removed from localStorage. It should not re-appear on next page load.

### Changing the quality of an task

As we said above, tasks should start out as “swill.” In order to change the recorded quality of an task, the user will interact with it from the task list.

* Each task in the list should include an “upvote” and “downvote” button.
* Clicking upvote on the task should increase its quality one notch (“swill” → “plausible”, “plausible” → “genius”).
* Clicking downvote on the task should decrease its quality one notch (“genius” → “plausible”, “plausible” → “swill”).
* Incrementing a “genius” task or decrementing a “swill” task should have no effect.

### Editing an existing task

* When a user clicks the title or body of an task in the list, that text should become an editable text field, pre-populated with the existing task title or body.
* The user should be able to “commit” their changes by pressing “Enter/Return” or by clicking outside of the text field.
* If the user reloads the page, their edits will be reflected.

### task Filtering and Searching

We’d like our users to be able to easily find specific tasks they already created, so let’s provide them with a filtering interface on the task list.

* At the top of the task list, include a text field labeled “Search”.
* As a user types in the search box, the list of tasks should filter in real time to only display tasks whose title or body include the user’s text. The page should not reload.
* Clearing the search box should restore all the tasks to the list.

## Layout comps: 

![full size image comp](images/ideabox-desktop.png?raw=true "Original Comp")

![mobile image comp](images/ideabox-mobile.png?raw=true "Original Comp mobile")

## Our 2DoBox

![full size image comp](images/2dobox-desktop.png?raw=true "Original Comp")

![mobile image comp](images/2dobox-mobile.png?raw=true "Original Comp mobile")


## Contributors:

* **James Logue** - 2DoBox-Pivot - github: (https://github.com/jjlljj)
* **Emily Kuckelman** - 2DoBox-Pivot - github: (https://github.com/ekuckelman)


Original IdeaBox repo here: (https://github.com/michellehoffman/ideabox)

* **Nora Gully** - Contributor to IdeaBox repo - github: (https://github.com/nogully)
* **Michelle Gully** - AContributor to IdeaBox repo - github: (https://github.com/michellehoffman)



