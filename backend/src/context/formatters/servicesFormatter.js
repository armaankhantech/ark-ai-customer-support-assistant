function formatServices(services) {

    if (!services || services.length === 0) {
        return "No services found.";
    }

    let context = "Services\n\n";

    services.forEach(service => {

        context +=
`Service: ${service.service_name}
Description: ${service.description}

`;

    });

    return context;

}

module.exports = {
    formatServices
};