// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">Core Economics</li><li class="chapter-item expanded "><a href="chapters/basic-economics.html"><strong aria-hidden="true">1.</strong> Basic Economics</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapters/basic-economics/incentives.html"><strong aria-hidden="true">1.1.</strong> Incentives and Trade-offs</a></li><li class="chapter-item expanded "><a href="chapters/basic-economics/prices.html"><strong aria-hidden="true">1.2.</strong> Prices and Information</a></li><li class="chapter-item expanded "><a href="chapters/basic-economics/supply-demand.html"><strong aria-hidden="true">1.3.</strong> Supply and Demand</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Economic Thinking</li><li class="chapter-item expanded "><a href="chapters/facts-and-fallacies.html"><strong aria-hidden="true">2.</strong> Economic Facts and Fallacies</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapters/facts-and-fallacies/zero-sum.html"><strong aria-hidden="true">2.1.</strong> The Zero-Sum Fallacy</a></li><li class="chapter-item expanded "><a href="chapters/facts-and-fallacies/free-market.html"><strong aria-hidden="true">2.2.</strong> The Free Market</a></li><li class="chapter-item expanded "><a href="chapters/facts-and-fallacies/government.html"><strong aria-hidden="true">2.3.</strong> Government Intervention</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Society and Economics</li><li class="chapter-item expanded "><a href="chapters/vision-anointed.html"><strong aria-hidden="true">3.</strong> Vision of the Anointed</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapters/vision-anointed/intellectuals.html"><strong aria-hidden="true">3.1.</strong> Intellectuals and Society</a></li><li class="chapter-item expanded "><a href="chapters/vision-anointed/cosmic-justice.html"><strong aria-hidden="true">3.2.</strong> The Quest for Cosmic Justice</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Applied Economics</li><li class="chapter-item expanded "><a href="chapters/real-world.html"><strong aria-hidden="true">4.</strong> Real World Applications</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapters/real-world/education.html"><strong aria-hidden="true">4.1.</strong> Education</a></li><li class="chapter-item expanded "><a href="chapters/real-world/housing.html"><strong aria-hidden="true">4.2.</strong> Housing</a></li><li class="chapter-item expanded "><a href="chapters/real-world/healthcare.html"><strong aria-hidden="true">4.3.</strong> Healthcare</a></li><li class="chapter-item expanded "><a href="chapters/real-world/labor-market.html"><strong aria-hidden="true">4.4.</strong> Labor Market</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
