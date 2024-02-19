import {Info} from "./types/info";
import {Domain, DomainIdentity} from "./types/domain";
import {ApiResponse, ApiResponseDomain} from "./types/apiResponse";
import {ApiService} from "./services/api.js";
import {Email, MimeAttachment} from "./types/email";
import {createMimeMessage} from 'mimetext';
import path from 'path';
import fs from 'fs';
// @ts-ignore
import mime from 'mime/lite';

export class AcyMailer {
    private apiService: ApiService;

    constructor(apiKey: string) {
        this.apiService = new ApiService(apiKey);
    }

    private checkDomain = (domainName: string): boolean => {
        const domainRegex = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]\.[a-z.]{2,6}$/;
        return domainRegex.test(domainName);
    }

    public getLicenseInfo = async (): Promise<Info> => {
        return this.apiService.request('/api/get_credits');
    }

    public addDomain = async (domain: Domain): Promise<ApiResponseDomain> => {
        if (!this.checkDomain(domain.name)) {
            throw new Error('Invalid domain name');
        }

        const domainToAdd = {
            domain: domain.name,
            siteUrl: domain.siteUrl ? domain.siteUrl : `https://${domain.name}`
        }

        const response = await this.apiService.request('/api/createDomainIdentity', 'POST', domainToAdd);

        // Domain already exists
        if (response.data && response.data[domain.name]) {
            return {
                message: response.message,
                cnameRecords: response.data[domain.name].cnameRecords,
                status: response.data[domain.name].status
            }
        }

        return {
            message: response.message,
            cnameRecords: response.cnameRecords
        }
    }

    public deleteDomain = async (domain: Domain): Promise<ApiResponse> => {
        const domainToDelete = {
            domain: domain.name,
            siteUrl: domain.siteUrl ? domain.siteUrl : `https://${domain.name}`
        }

        await this.apiService.request('/api/deleteDomainIdentity', 'DELETE', domainToDelete);

        return {
            message: 'Domain deleted successfully'
        }
    }

    public sendEmail = async (email: Email) => {

        if (!email.replyToEmail) {
            email.replyToEmail = email.fromEmail;
        }

        if (!email.replyToName) {
            email.replyToName = email.fromName;
        }

        if (!email.bounceEmail) {
            email.bounceEmail = email.fromEmail;
        }

        if (!email.altBody) {
            email.altBody = email.body.replace(/<\/?[^>]+(>|$)/g, "");
        }

        const mimeMessage = createMimeMessage();
        mimeMessage.setSender({name: email.fromName, addr: email.fromEmail});
        mimeMessage.setRecipient(email.to);
        mimeMessage.setSubject(email.subject);
        mimeMessage.addMessage({
            contentType: 'text/html',
            data: email.body
        });
        mimeMessage.addMessage({
            contentType: 'text/plain',
            data: email.altBody
        });
        mimeMessage.setHeader('Return-Path', email.bounceEmail);

        if (email.cc) {
            email.cc.forEach((cc: string) => {
                mimeMessage.setCc(cc);
            });
        }

        if (email.attachments?.length) {
            this.getAttachments(email).forEach((attachment: MimeAttachment) => {
                mimeMessage.addAttachment(attachment);
            });
        }

        const requestOption = {
            email: mimeMessage.asRaw(),
            domainsUsed: this.getDomainsUsed(email)
        }

        return this.apiService.request('/api/send', 'POST', requestOption);
    }

    private getDomainsUsed = (email: Email): string[] => {
        const emailKeys = ['fromEmail', 'replyToEmail', 'bounceEmail'];
        const domains = emailKeys.map((key: string) => {
            // @ts-ignore
            return email[key].split('@')[1];
        });

        return Array.from(new Set(domains));
    }

    private getAttachments = (email: Email): MimeAttachment[] => {
        // @ts-ignore
        return email.attachments.map((attachment: string) => {
            if (!fs.existsSync(attachment)) {
                throw new Error('Attachment file not found');
            }
            return {
                filename: path.basename(attachment),
                contentType: mime.getType(attachment),
                data: fs.readFileSync(attachment, {encoding: 'base64'})
            }
        })
    }

    public updateDomain = async (domain: DomainIdentity) => {
        if (!domain.id) {
            throw new Error('Domain id is required');
        }

        if (domain.isLimited === undefined && domain.creditsAllowed === undefined) {
            throw new Error('isLimited or creditsAllowed is required to update domain');
        }

        const domainToUpdate = {
            isLimited: domain.isLimited,
            creditsAllowed: domain.creditsAllowed
        };

        await this.apiService.request(`/api/domains/${domain.id}`, 'PATCH', domainToUpdate);

        return {
            message: 'Domain updated successfully'
        }
    }
}
