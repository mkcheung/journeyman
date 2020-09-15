export const check = (rules, role, action, userPermissions) => {
    const permissions = rules[role];
    if (!permissions) {
        // role is not present in the rules
        return false;
    }

    if (role === 'Admin') {
        return true;
    }

    const staticPermissions = permissions.static;

    if (staticPermissions && staticPermissions.includes(action)) {
        // static rule not provided for action
        return true;
    }

    if (userPermissions && userPermissions.includes(action)) {
        return true;
    }
    return false;
};

const Can = props =>
    check(props.rules, props.role, props.perform, props.userSpecificPermissions)
        ? props.yes()
        : props.no();

Can.defaultProps = {
    yes: () => null,
    no: () => null
};

export default Can;