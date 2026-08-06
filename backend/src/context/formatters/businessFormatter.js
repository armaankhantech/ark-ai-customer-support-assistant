function formatBusiness(company) {

    if (!company) {
        return "No company information found.";
    }

    return `Company Information

Company Name: ${company.company_name}

About:
${company.about}

Business Hours:
${company.business_hours}

Website:
${company.website}

Email:
${company.email}

Phone:
${company.phone}`;

}

module.exports = {
    formatBusiness
};