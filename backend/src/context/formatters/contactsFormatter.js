function formatContacts(contacts) {

    if (!contacts || contacts.length === 0) {
        return "No contact information found.";
    }

    let context = "Contact Information\n\n";

    contacts.forEach(contact => {

        context +=
`Department: ${contact.department}
Email: ${contact.email}
Phone: ${contact.phone}

`;

    });

    return context;

}

module.exports = {
    formatContacts
};