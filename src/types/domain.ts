export interface Domain {
    name: string,
    siteUrl?: string,
}

export interface DomainIdentity {
    id: number,
    isLimited: boolean,
    creditsAllowed: number,
}
