# data-schema
Enforce constraints on and validate your javascript data.

## Examples
```js
import * as schema from 'data-schema';

// A single string value
let myString = schema.ManagedObject(
    schema.string({maxLength:5, isRequired: true})
);

myString.set([]);  // throws "Value must be a string: []"

myString.set("more than 5 characters");

console.log(myString.errors); // ['String is too long']

console.log(myString.get()); // 'more than 5 characters'

// Example schema to define a text input in a web form
const textQuestion = schema.shape({
  questionText: schema.string({isRequired: true}),
  isRequired: schema.bool(),
  isMultiline: schema.bool(),
  maxChars: schema.integer({max: 100})
});

let question = schema.ManagedObject(textQuestion);
question.managed.questionText.set('Please enter your name');
question.managed.maxChars.set(50);

console.log(question.errors); // []

console.log(question.get());
// {questionText: 'Please enter your name', maxChars: 50}

```

## API documentation
### Built in types
#### schema.string
TODO

#### schema.bool
TODO

#### schema.integer
TODO

#### schema.choice
TODO

#### schema.multichoice
TODO

#### schema.array
TODO

#### schema.shape
TODO

### Extending via plugins
TODO
