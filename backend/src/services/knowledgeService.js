const db = require("../database/postgres");

async function getCompany(companyId) {
  const query = `
    SELECT *
    FROM company
    WHERE id = $1
  `;

  const result = await db.query(query, [companyId]);

  return result.rows[0] || null;
}

async function getServices(companyId) {
  const query = `
    SELECT service_name, description
    FROM services
    WHERE company_id = $1
    ORDER BY id;
  `;

  const result = await db.query(query, [companyId]);

  return result.rows;
}

async function getFAQs(companyId) {
  const query = `
    SELECT question, answer
    FROM faq
    WHERE company_id = $1
    ORDER BY id;
  `;

  const result = await db.query(query, [companyId]);

  return result.rows;
}

async function getPolicies(companyId) {
  const query = `
    SELECT policy_type, content
    FROM policies
    WHERE company_id = $1
    ORDER BY id;
  `;

  const result = await db.query(query, [companyId]);

  return result.rows;
}

async function getContacts(companyId) {
  const query = `
    SELECT department, email, phone
    FROM contacts
    WHERE company_id = $1
    ORDER BY id;
  `;

  const result = await db.query(query, [companyId]);

  return result.rows;
}

async function getKnowledgeByIntent(companyId, intent) {

    switch (intent) {

        case "business":
            return {
                company: await getCompany(companyId)
            };

        case "contacts":
            return {
                contacts: await getContacts(companyId)
            };

        case "services":
            return {
                services: await getServices(companyId)
            };

        case "policies":
            return {
                policies: await getPolicies(companyId)
            };

        case "faq":
            return {
                faqs: await getFAQs(companyId)
            };

        default:
            return {
                company: await getCompany(companyId)
            };

    }

}

async function getKnowledgeByIntent(companyId, intent) {

    switch (intent) {

        case "business":
            return {
                company: await getCompany(companyId)
            };

        case "contacts":
            return {
                contacts: await getContacts(companyId)
            };

        case "services":
            return {
                services: await getServices(companyId)
            };

        case "policies":
            return {
                policies: await getPolicies(companyId)
            };

        case "faq":
            return {
                faqs: await getFAQs(companyId)
            };

        default:
            return {
                company: await getCompany(companyId)
            };

    }

}
module.exports = {
    getKnowledgeByIntent
};