"use strict";

import * as express from "express";
import * as passport from "passport";
import { Strategy as SamlStrategy } from "passport-saml";
import * as bodyParser from "body-parser";

const SHIB_URL_PREFIX = "/auth/shibboleth/";
const SHIB_URLS = {
    callback: `${SHIB_URL_PREFIX}callback`,
    login: `${SHIB_URL_PREFIX}login`,
    failed: `${SHIB_URL_PREFIX}failed`,
};

const SHIB_ATTRIBUTE_MAP = {
    "urn:oid:1.3.6.1.4.1.8482.1.1.1": "colostateEduPersonCSUID",
    "urn:oid:1.3.6.1.4.1.8482.1.1.2": "colostateEduPersonEID",
    "urn:oid:1.3.6.1.4.1.8482.1.1.3": "colostateEduPersonEIDIRID",
    "urn:oid:1.3.6.1.4.1.8482.1.1.4": "colostateEduPersonEIDAccountType",
    "urn:oid:1.3.6.1.4.1.8482.1.1.5": "colostateEduPersonAriesID",
    "urn:oid:1.3.6.1.4.1.8482.1.1.6": "colostateEduPersonHRID",
    "urn:oid:1.3.6.1.4.1.8482.1.1.7": "colostateEduPersonAssociateID",
    "urn:oid:1.3.6.1.4.1.5923.1.1.1.2": "eduPersonNickname",
    "urn:oid:1.3.6.1.4.1.5923.1.1.1.6": "eduPersonPrincipalName",
    "urn:oid:1.3.6.1.4.1.5923.1.1.1.7": "eduPersonEntitlement",
    "urn:oid:1.3.6.1.4.1.5923.1.1.1.9": "eduPersonScopedAffiliation",
    "urn:oid:1.3.6.1.4.1.5923.1.1.1.10": "eduPersonTargetedID",
    "urn:oid:0.9.2342.19200300.100.1.3": "mail",
    "urn:oid:2.5.4.4": "sn",
    "urn:oid:2.5.4.42": "givenName",
    "urn:oid:2.16.840.1.113730.3.1.241": "displayName",
} as any;

export default function passportColostate({ login }: any) {
    const {
        name,
        shib: { loginPath, callbackUrl, debug},
    } = login;

    if (debug) {
        console.log("passportColostate: config:");
        console.log("GET login URL:", loginPath);
        console.log("POST callback URL:", callbackUrl);
        console.log(login.shib);
    }

    const strategy = new SamlStrategy(
        {
            name: login.name,
            identifierFormat: false,
            ...login.shib,
        },
        function (
            profile: any,
            done: (error: Error | null, profile?: any) => void
        ) {
            if (debug) {
                console.log({ profile });
                console.log(profile.getAssertionXml());
                console.log(JSON.stringify(profile.getAssertion()));
                console.log(profile.getSamlResponseXml());
            }

            try {
                const normalizedProfile = {} as any;

                for (let key in profile) {
                    if (SHIB_ATTRIBUTE_MAP[key]) {
                        normalizedProfile[SHIB_ATTRIBUTE_MAP[key]] = profile[key];
                    } else {
                        // Uncomment out next line if you want to include all attributes (even if they are not in the SHIB_ATTRIBUTE_MAP)
                        // normalizedProfile[key] = profile[key];
                    }
                }

                if (debug) {
                    console.log({ normalizedProfile });
                }

                done(null, normalizedProfile);
            } catch (e) {
                done(e);
            }
        }
    );

    passport.use(strategy);

    return express
        .Router()
        .get(
            loginPath,
            passport.authenticate(name, { failureRedirect: SHIB_URLS.failed }),
            (_req, res) => res.end()
        )
        .post(
            SHIB_URLS.callback,
            bodyParser.urlencoded({ extended: false }),
            passport.authenticate(name, { failureRedirect: SHIB_URLS.failed }),
            restoreUrl()
        );
}

export function ensureAuth(loginUrl?: string) {
    loginUrl = loginUrl || "/auth" + SHIB_URLS.login;

    return function (
        req: any,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect(`${loginUrl}/?RelayState=${req.query.RelayState}`);
        }
    }
}

export function restoreUrl(defaultUrl?: string) {
    return function (req: any, res: express.Response) {
        let url = defaultUrl || "/";

        if (req.body?.RelayState) {
            url = req.body.RelayState;
        }

        res.redirect(url);
    };
}