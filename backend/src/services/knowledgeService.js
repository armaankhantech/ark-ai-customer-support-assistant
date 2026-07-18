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

async function getKnowledge(companyId) {
  const company = await getCompany(companyId);
  const services = await getServices(companyId);
  const faqs = await getFAQs(companyId);
  const policies = await getPolicies(companyId);
  const contacts = await getContacts(companyId);

  return {
    company,
    services,
    faqs,
    policies,
    contacts
  };
}

module.exports = {
  getKnowledge
};
async function test() {
  const knowledge = await getKnowledge(1);

  console.log(JSON.stringify(knowledge, null, 2));
}

test();
