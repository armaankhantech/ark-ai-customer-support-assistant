const { formatBusiness } = require("./formatters/businessFormatter");
const { formatContacts } = require("./formatters/contactsFormatter");
const { formatServices } = require("./formatters/servicesFormatter");
const { formatPolicies } = require("./formatters/policiesFormatter");
const { formatFaq } = require("./formatters/faqFormatter");

const FORMATTERS = {
    business: (knowledge) => formatBusiness(knowledge.company),

    contacts: (knowledge) => formatContacts(knowledge.contacts),

    pricing: (knowledge) => `
Pricing Information:
ARK AI services are customized according to the customer's requirements,
project scope, integrations, and level of automation.

Pricing varies from project to project.

For a personalized quote, customers can contact ARK AI at:
${knowledge.company?.email || "the ARK AI team"}.
`,

    services: (knowledge) => formatServices(knowledge.services),

    policies: (knowledge) => formatPolicies(knowledge.policies),

    faq: (knowledge) => formatFaq(knowledge.faqs)
};

function buildContextText(intent, knowledge) {

    const formatter = FORMATTERS[intent];

    if (!formatter) {
        return "";
    }

    return formatter(knowledge);

}

module.exports = {
    buildContextText
};