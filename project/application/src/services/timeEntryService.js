export function encodeTimeEntryIssue(issue) {
    const encodedIssue = issue ? encodeURI(issue) : '';

    return encodedIssue;
}

export function decodeTimeEntryIssue(issue) {
    const decodedIssue = issue ? decodeURI(issue) : '';

    return decodedIssue;
}
