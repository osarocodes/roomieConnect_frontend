// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('test');

// Create a new document in the collection.
db.getCollection('users').updateOne(
    { "identity.email": "admin@roomiehub.com" },
    { $set: { "identity.role": "Admin" } }
);