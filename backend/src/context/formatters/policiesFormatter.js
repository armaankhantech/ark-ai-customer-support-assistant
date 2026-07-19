function formatPolicies(policies) {

    if (!policies || policies.length === 0) {
        return "No policies found.";
    }

    let context = "Policies\n\n";

    policies.forEach(policy => {

        context +=
`Policy: ${policy.policy_type}
Details: ${policy.content}

`;

    });

    return context;

}

module.exports = {
    formatPolicies
};