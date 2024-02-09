export interface Cname {
    name: string;
    type: string;
    value: string;
}

interface Domain {
    id: number;
    name: string;
    complaint_rate: number;
    bounce_rate: number;
    allowed_complaint_rate: number;
    allowed_bounce_rate: number;
    warning_complaint_rate: number;
    warning_bounce_rate: number;
    cname: Cname[];
    status: string;
    is_limited?: boolean;
    credits_allowed?: number;
    credits_used?: number;
    remaining_credits?: number;
    blocked?: boolean;
}

interface DateTime {
    date: string;
    timezone_type: number;
    timezone: string;
}

export interface Info {
    credits_used: number;
    max_credits: number;
    extra_credits: number;
    remaining_credits: number;
    license_level: string;
    end_date: DateTime,
    blocked: boolean;
    underVerification: boolean;
    is_multisite: boolean;
    credits_multisite_left?: number;
}
