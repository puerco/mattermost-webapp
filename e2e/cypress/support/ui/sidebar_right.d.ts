// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/// <reference types="cypress" />

// ***************************************************************
// Each command should be properly documented using JSDoc.
// See https://jsdoc.app/index.html for reference.
// Basic requirements for documentation are the following:
// - Meaningful description
// - Each parameter with `@params`
// - Return value with `@returns`
// - Example usage with `@example`
// Custom command should follow naming convention of having `ui` prefix, e.g. `uiOpenFilePreview`.
// ***************************************************************

declare namespace Cypress {
    interface Chainable {

        /**
         * Get RHS container
         *
         *  @param {bool} option.exist - Set to false to not verify if the element exists. Otherwise, true (default) to check existence.
         *
         * @example
         *   cy.uiGetRHS();
         */
        uiGetRHS(option: Record<string, boolean>): Chainable;
    }
}
