# Globalize Ready-mix

You want to use Globalize 1.x but you want it to be easy like it was in the old days?  This is what you need!

Globalize Ready-mix does 2 things:
- Tells you what CLDR / Globalize module files you need depending on the functionality you require
- Assembles a collection of globalize.`locale`.js files which load locale data into Globalize.

This is particularly useful for people using Globalize in the browser as it means loading via ajax is not required.  

## Gettings started

You want everything?  Then use this:
`npm run mix -- --currency --date --message --number --plural --relativeTime`

You just want numbers?  Then use this:
`npm run mix -- --number`

Core comes with everything.

// Currency
// Date
// Number
// Plural
// Relative time
