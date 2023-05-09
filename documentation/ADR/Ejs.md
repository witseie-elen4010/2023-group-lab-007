# Implementing EJS over HTML in a Node and Express app

## Status

Accepted

## Context

We are building a Node.js and Express application that requires rendering HTML templates with dynamic content. We could use plain HTML files for this purpose, but this has several limitations and drawbacks, such as:

- Limited ability to include dynamic content or logic
- Code duplication across pages
- Inability to reuse common elements across pages
- Inability to leverage JavaScript modules or other frontend technologies

After researching several options, we have decided to use Embedded JavaScript (EJS) as our templating language for this application.

## Decision

We will integrate EJS with our Node.js and Express app to handle rendering of HTML templates with dynamic content. This will involve the following steps:

- Install the EJS module and any necessary plugins or dependencies
- Configure Express to use EJS as the view engine
- Create EJS templates for our web pages, using the appropriate syntax to include dynamic content and logic
- Render the EJS templates with the appropriate data from our Node.js backend

## Consequences

### Pros

- We will have a more flexible and powerful templating solution that can handle dynamic content and logic, as well as reuse common elements across pages
- EJS templates are easier to read and write than raw HTML files, and provide a clear separation between content and presentation
- EJS templates can leverage JavaScript modules and other frontend technologies, such as CSS preprocessors or client-side frameworks
- Using EJS improves code consistency and maintainability by providing a standardized templating interface

### Cons

- We will have to learn and integrate a new technology, which may take some time and effort.
- There may be some additional overhead and complexity associated with using a more feature-rich templating language, compared to plain HTML files
- There may be some performance impact associated with rendering templates on the server-side, although this is usually negligible.
