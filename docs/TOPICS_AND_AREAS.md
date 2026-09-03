# Topics and areas

Topics are objects in platform.json topics[]. They are not markdown.

Required: id (stable), slug (URL), name, shortName, description, badge, category, color, order, enabled, featured, showOnHomepage, showInNavigation, status.

## Add

Push a new object. Start planned, showOnHomepage false, showInNavigation false. Add real markdown with topic: that id. Then status active. showOnHomepage true puts it in topic-grid. showInNavigation true plus a nav source, or the kernel auto-appends public navigation topics.

Do not invent Python (or any) lesson text. The topic can exist as planned with zero files.

## Rename

Change name, shortName, slug on the same id. Nav and homepage that bind to the id pick up the new slug.

## Disable / re-enable

Hide everywhere: enabled false, or status disabled / paused / archived. Put back: enabled true, status active, with real content if it should have a route or homepage card.

## Hide from homepage only

Keep status active. Set showOnHomepage false. The topic page can still exist if contentCount > 0.

## Remove

Delete the object. Source-bound nav drops. The resolver must not throw (scenario test 3). Prefer disable unless you are sure.

See OPERATIONS.md for JSON snippets.
