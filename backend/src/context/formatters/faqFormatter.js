function formatFaq(faqs) {

    if (!faqs || faqs.length === 0) {
        return "No FAQs found.";
    }

    let context = "Frequently Asked Questions\n\n";

    faqs.forEach(faq => {

        context +=
`Q: ${faq.question}
A: ${faq.answer}

`;

    });

    return context;

}

module.exports = {
    formatFaq
};