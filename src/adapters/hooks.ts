import { useContext } from 'react';
import { Data, DocumentData } from '@sitebud/bridge-lib';
import { DocumentContentContextInstance } from './ContentAdapterProvider';
import { MainPageContentAdapter } from './MainPageContentAdapter';
import { SiteContentAdapter } from './SiteContentAdapter';

import type { DocumentContentContext } from './types';

function adaptDocumentData(documentData: DocumentData): DocumentContentContext {
    const documentContentContext: DocumentContentContext = {};
    if (documentData && documentData.content && documentData.name) {
        switch (documentData.name) {
            case 'MainPage':
                documentContentContext.mainPageContent =
                    new MainPageContentAdapter(
                        documentData,
                        adaptDocumentData
                    ).adapt();
                break;

            case 'Site':
                documentContentContext.siteContent = new SiteContentAdapter(
                    documentData,
                    adaptDocumentData
                ).adapt();
                break;
        }
    }
    return documentContentContext;
}

function adaptData(data: Data): DocumentContentContext {
    const { pageData, siteData } = data;
    let documentContentContext: DocumentContentContext =
        adaptDocumentData(pageData);
    documentContentContext = {
        ...documentContentContext,
        ...adaptDocumentData(siteData),
    };
    return documentContentContext;
}

export function useDocumentDataAdapter(data: Data): DocumentContentContext {
    return adaptData(data);
}

export function useAdaptedContent(): DocumentContentContext {
    return useContext(DocumentContentContextInstance);
}

export function useLastAuthor(
    authors?: Record<string, number>
): string | undefined {
    let authorEmail: string | undefined;
    if (authors) {
        let authorEntries: Array<[string, number]> = Object.entries(authors);
        if (authorEntries.length > 0) {
            authorEntries = authorEntries.sort((a, b) => b[1] - a[1]);
            authorEmail = authorEntries[0][0];
        }
    }
    return authorEmail;
}
