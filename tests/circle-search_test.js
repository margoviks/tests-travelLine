const Joi = require('joi');

Feature('codeceptjs');

const testCases = [
    {
        name: 'Позитивный тест',
        latitude: 56.637028,
        longitude: 47.8772,
        radius: 10000,
        count: 500,
        expectedCode: 200
    },
    {
        name: 'Негативный тест 1',
        latitude: 56.637028,
        longitude: 47.8772,
        radius: 10000,
        count: 5000,
        expectedCode: 400
    },
    {
        name: 'Негативный тест 2',
        latitude: -156.637028,
        longitude: -247.8772,
        radius: 100000,
        count: 500,
        expectedCode: 500
    },
]

testCases.forEach((testCase) => {
    Scenario('Поиск средств размещений по окружности: ' + testCase.name, ({I}) => {
        I.sendGetRequest(`/v1/properties/circle-search?latitude=${testCase.latitude}&longitude=${testCase.longitude}&radius=${testCase.radius}&count=${testCase.count}`);

        I.seeResponseCodeIs(testCase.expectedCode);

        if (testCase.expectedCode === 200) {
            const schema = Joi.object({
                next: Joi.string().allow(null),
                properties: Joi.array().items(
                    Joi.object({
                            id: Joi.number().allow(null),
                            name: Joi.string().allow(null),
                            cityId: Joi.number().allow(null),
                            regionId: Joi.number().allow(null),
                            countryCode: Joi.string().max(3).allow(null),
                            longitude: Joi.number().min(-90).max(90).allow(null),
                            latitude: Joi.number().min(-180).max(180).allow(null)
                        }
                    )
                )
            });

            I.seeResponseMatchesJsonSchema(schema);
        }

        if (testCase.expectedCode === 400) {
            const schema = Joi.object({
                errors: Joi.array().items(
                    Joi.object({
                            code: Joi.string(),
                            message: Joi.string(),
                        }
                    )
                )
            });

            I.seeResponseMatchesJsonSchema(schema);
        }
    });
})
