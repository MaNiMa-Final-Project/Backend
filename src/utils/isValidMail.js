
export default function isValidMail(email) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [local, domain] = email.split('@');

    if (!emailRegex.test(email)) {
    return false;
    }

    if (local.length < 2 || local.length > 64) {
    return false;
    }

    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts.length > 4) {
    return false;
    }

    for (const part of domainParts) {
    if (part.length < 2 || part.length > 63) {
        return false;
    }
    }

    return true;
}