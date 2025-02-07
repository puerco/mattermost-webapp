// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************
//
//  Group: @collapsed_reply_threads

describe('Collapsed Reply Threads', () => {
    let testTeam;
    let testUser;
    let otherUser;
    let testChannel;

    before(() => {
        cy.apiUpdateConfig({
            ServiceSettings: {
                ThreadAutoFollow: true,
                CollapsedThreads: 'default_off',
            },
        });

        // # Create new channel and other user and add other user to channel
        cy.apiInitSetup({loginAfter: true, promoteNewUserAsAdmin: true}).then(({team, channel, user}) => {
            testTeam = team;
            testUser = user;
            testChannel = channel;

            cy.apiSaveCRTPreference(testUser.id, 'on');
            cy.apiCreateUser({prefix: 'other'}).then(({user: user1}) => {
                otherUser = user1;

                cy.apiAddUserToTeam(testTeam.id, otherUser.id).then(() => {
                    cy.apiAddUserToChannel(testChannel.id, otherUser.id);
                });
            });
        });
    });

    beforeEach(() => {
        // # Visit channel
        cy.visit(`/${testTeam.name}/channels/${testChannel.name}`);
    });

    it('MM-T4141_1 should follow a thread after replying', () => {
        // # Post message as other user
        cy.postMessageAs({
            sender: otherUser,
            message: 'Root post,',
            channelId: testChannel.id,
        }).then(({id: rootId}) => {
            // * Thread footer should not be visible
            cy.get(`#post_${rootId}`).find('.ThreadFooter').should('not.exist');

            // # Click on post to open RHS
            cy.get(`#post_${rootId}`).click();

            // * Button on header should say Follow as current user is not following
            cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Follow');

            // # Post a reply as current user
            cy.postMessageReplyInRHS('Reply!');

            // # Get last root post
            cy.get(`#post_${rootId}`).

                // * thread footer should exist now
                get('.ThreadFooter').should('exist').
                within(() => {
                    // * the button on the footer should say Following
                    cy.get('.FollowButton').should('have.text', 'Following');
                });

            // * the button on the RHS header should now say Following
            cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Following');

            // # Visit global threads
            cy.uiVisitSidebarItem('threads');

            // * There should be a thread there
            cy.get('article.ThreadItem').should('have.have.lengthOf', 1);
        });
    });

    it('MM-T4141_2 should follow a thread after marking it as unread', () => {
        // # Post a root post as other user
        cy.postMessageAs({
            sender: otherUser,
            message: 'Another interesting post,',
            channelId: testChannel.id,
        }).then(({id: rootId}) => {
            // # Post a self reply as other user
            cy.postMessageAs({
                sender: otherUser,
                message: 'Self reply!',
                channelId: testChannel.id,
                rootId,
            }).then(({id: replyId}) => {
                // # Get root post
                cy.get(`#post_${rootId}`).within(() => {
                    // * Thread footer should be visible
                    cy.get('.ThreadFooter').should('exist').

                        // * Thread footer button should say 'Follow'
                        find('.FollowButton').should('have.text', 'Follow');
                });

                // # Click on root post to open thread
                cy.get(`#post_${rootId}`).click();

                // * RHS header button should say 'Follow'
                cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Follow');

                // # Click on the reply's dot menu and mark as unread
                cy.uiClickPostDropdownMenu(replyId, 'Mark as Unread', 'RHS_COMMENT');

                // * RHS header button should say 'Following'
                cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Following');

                // # Get root post
                cy.get(`#post_${rootId}`).within(() => {
                    // * Thread footer should be visible
                    cy.get('.ThreadFooter').should('exist').

                        // * Thread footer button should say 'Following'
                        find('.FollowButton').should('have.text', 'Following');
                });

                // # Visit global threads
                cy.uiVisitSidebarItem('threads');

                // * There should be 2 threads now
                cy.get('article.ThreadItem').should('have.have.lengthOf', 2);
            });
        });
    });

    it('MM-T4141_3 clicking "Following" button in the footer should unfollow the thread', () => {
        // # Post a root post as other user
        cy.postMessageAs({
            sender: otherUser,
            message: 'Another interesting post,',
            channelId: testChannel.id,
        }).then(({id: rootId}) => {
            // # Post a reply as current user
            cy.postMessageAs({
                sender: testUser,
                message: 'Self reply!',
                channelId: testChannel.id,
                rootId,
            });
        });

        // # Get last root post in channel
        cy.getLastPostId().then((rootId) => {
            // # Open the thread
            cy.get(`#post_${rootId}`).click();

            // * RHS header button should say 'Following'
            cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Following');

            // # Get thread footer of last root post
            cy.get(`#post_${rootId}`).within(() => {
                // * thread footer should exist
                cy.get('.ThreadFooter').should('exist');

                // * thread footer button should say 'Following'
                cy.get('.FollowButton').should('have.text', 'Following');

                // # Click thread footer Following button
                cy.get('.FollowButton').click();

                // * thread footer button should say 'Follow'
                cy.get('.FollowButton').should('have.text', 'Follow');
            });

            // * RHS header button should say 'Follow'
            cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Follow');

            // # Close RHS
            cy.closeRHS();
        });
    });

    it('MM-T4141_4 clicking "Follow" button in the footer should follow the thread', () => {
        // # Post a root post as other user
        cy.postMessageAs({
            sender: otherUser,
            message: 'Another interesting post,',
            channelId: testChannel.id,
        }).then(({id: rootId}) => {
            // # Post a self reply as other user
            cy.postMessageAs({
                sender: otherUser,
                message: 'Self reply!',
                channelId: testChannel.id,
                rootId,
            });
        });

        // # Get last root post in channel
        cy.getLastPostId().then((rootId) => {
            // # Open the thread
            cy.get(`#post_${rootId}`).click();

            // * RHS header button should say 'Follow'
            cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Follow');

            // # Get thread footer of last root post
            cy.get(`#post_${rootId}`).within(() => {
                // * thread footer should exist
                cy.get('.ThreadFooter').should('exist');

                // * thread footer button should say 'Follow'
                cy.get('.FollowButton').should('have.text', 'Follow');

                // # Click thread footer 'Follow' button
                cy.get('.FollowButton').click();

                // * thread footer button should say 'Following'
                cy.get('.FollowButton').should('have.text', 'Following');
            });

            // * RHS header button should say 'Following'
            cy.get('#rhsContainer').find('.FollowButton').should('have.text', 'Following');

            // # Close RHS
            cy.closeRHS();
        });
    });
});
