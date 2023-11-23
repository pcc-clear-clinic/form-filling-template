## Project setup
 1. Always do new work on a git branch other than the `main` branch. run `git checkout -b branch-name`. This can be a short name indicating what you're working on, like "finish-eviction-form"
 2. Run `npm run dev` in the project root to launch the project locally. You can navigate to `localhost:3000` to view your latest changes. It's a hot-reload server, so it automatically updates to show the latest code.



## To add a new form:

(this has been completed for EvictionForm already)
 1. Copy the EvictionForm folder and its contents, and rename it to SomethingForm.
 2. Add an entry in App.tsx using this new component with a new "path" name. This will be the url path to the new page.
 3. Add the pdf file to the pdfs directory.
 4. Add an entry on FrontPage.tsx to make a link to the new component. (this could wait until you're done implementing the new form, in order to not expose incomplete work)
 
 ## To customize a form

 1. use the utility script examinePdf.ts to see the names of the pdf fields in the file. To do this:
    * update the url to the new file in the script. The url you already see there won't have the new file in that folder yet until you commit and push changes (see below)
    * compile the file into js by running this in the project root: `npx tsc`
    * run it with `node dist/examinePdf.js`
 2. In the new `index.tsx` file, Rename `EvictionFormField` and its child field to something appropriate. 
 3.  For a new form, rename `EVICTION_FIELDS_IN_SECTIONS` and populate it with the field the user needs to input in the app. 
  * In the variable definition, the type signature `: [React.ReactNode, EvictionFormField[]]` indicates that the allowed type format is an array pairs of `React.ReactNode` type and an array of `EvictionFormField` type. The first is the section header: `React.ReactNode` type is anything that renders as valid react code, including raw text. The react type means that a section header can be more complex than just text, namely have an attached tooltip or something. See NameAndGenderForm for an example of this, as the "Waiver Requirements" header.
  * `EvictionFormField` is the type that specifies the fields in each entry that this data structure can contain. See comments on the `Field` type in `inputHandlersAndTypes.ts` for explanations of what goes into this field definition. The type `EvictionFormField = Field & {...}` means that `EvictionFormField` is a subtype of `Field`; it contains all the variables in `Field` and any extra that are defined here.
  * `INITIAL_FIELD_STATE` needs to contain an entry for each field in the list of fields defined above.
4. In `validate.ts`, Add the fields that are required or have other validation requirements to `TInvalidState`, and add them to `INITIAL_INVALID_STATE` with values `false`.
5. In `fillAndDownload.ts`, update `formUrl` to the new url of the file. Again, you'll have to check in the pdf file and merge to the main branch in order to make this pdf accessible at our own url.
6. Replace `EVICTION_FLATTENED_FIELDS` and `EvictionFormField` with the new variable names in `index.tsx`. 
7. Add any logic in the indicated section for populating fields automatically, for example computing sums. See `NameAndGenderForms/fillAndDownload.ts` for examples.

 ## Pushing changes to github:

 1. In the project root, run `git status` to list files that have changed and `git diff` to inspect changes.
 2. Add changed fileds with `git add path/to/file`. If you want to add everything you can use `git add .`. 
 3. Commit changes with `git commit -m "your message"`, with a commit messages that describes the changes made
 4. You can make multiple commits while working on a particular feature, and this can be useful to break up changes into steps that might be easier for another developer to understand.
 5. When ready for review, run `git push origin [branch-name]` to push your local branch to a branch on github.
 6. On github.com, open a pull request and tag another team member for review.
 7. When the changes are approved, hit "merge pull request" on the PR page.
 8. In your local project, checkout the main branch with `git checkout main` and pull the changes that have been merged in with `git pull origin main`
 9. Checkout a new branch to do more work. 
