// * One-off setup: creates the Pets custom object schema (associated with contacts) and three sample records.
// * Run with: node scripts/setup-custom-object.js  (requires PRIVATE_APP_ACCESS in .env)
require('dotenv').config();
const axios = require('axios');

const headers = {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

const schema = {
    name: 'pets',
    labels: { singular: 'Pet', plural: 'Pets' },
    primaryDisplayProperty: 'name',
    requiredProperties: ['name'],
    searchableProperties: ['name', 'species'],
    properties: [
        { name: 'name', label: 'Name', type: 'string', fieldType: 'text' },
        { name: 'species', label: 'Species', type: 'string', fieldType: 'text' },
        { name: 'age', label: 'Age', type: 'number', fieldType: 'number' }
    ],
    associatedObjects: ['CONTACT']
};

const pets = [
    { name: 'Bolinhas', species: 'Dog', age: 4 },
    { name: 'Mia', species: 'Cat', age: 2 },
    { name: 'Tico', species: 'Parrot', age: 7 }
];

(async () => {
    try {
        const account = await axios.get('https://api.hubapi.com/account-info/v3/details', { headers });
        const schemaResp = await axios.post('https://api.hubapi.com/crm/v3/schemas', schema, { headers });
        const objectTypeId = schemaResp.data.objectTypeId;

        for (const pet of pets) {
            await axios.post(`https://api.hubapi.com/crm/v3/objects/${objectTypeId}`, { properties: pet }, { headers });
        }

        console.log(`CUSTOM_OBJECT_TYPE=${objectTypeId}`);
        console.log(`List view: https://app.hubspot.com/contacts/${account.data.portalId}/objects/${objectTypeId}/views/all/list`);
    } catch (error) {
        console.error(error.response ? error.response.data : error);
    }
})();
