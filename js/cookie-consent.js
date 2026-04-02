(function () {
	const CONSENT_COOKIE = 'metel_cookie_consent';
	const CONSENT_ACCEPT = '1';
	const CONSENT_REJECT = '0';
	const MAX_AGE_SEC = 31536000;
	const GA_PROPERTY_ID = 'code_here';

	function consentFromCookie() {
		const match = document.cookie.match(
			new RegExp('(?:^|;\\s*)' + CONSENT_COOKIE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)')
		);
		return match ? decodeURIComponent(match[1].trim()) : '';
	}

	function setPreferenceCookie(value) {
		const secure =
			typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';

		document.cookie =
			CONSENT_COOKIE +
			'=' +
			encodeURIComponent(value) +
			'; Max-Age=' +
			MAX_AGE_SEC +
			'; Path=/; SameSite=Lax' +
			secure;
	}

	let gaStarted = false;
	function loadGoogleAnalytics() {
		if (gaStarted) return;
		gaStarted = true;
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			(i[r] =
				i[r] ||
				function () {
					(i[r].q = i[r].q || []).push(arguments);
				}),
				(i[r].l = 1 * new Date());
			(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m);
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		ga('create', GA_PROPERTY_ID, 'auto');
		ga('send', 'pageview');
	}

	function showBanner() {
		const el = document.createElement('div');
		el.className = 'cookie-consent-banner';
		el.setAttribute('role', 'dialog');
		el.setAttribute('aria-label', 'Cookie consent');
		el.innerHTML =
			'<div class="cookie-consent-banner__inner">' +
			'<p class="cookie-consent-banner__text">We use cookies to analyse usage and make our Websites work properly, as described in our <a href="privacy.html" class="cookie-consent-banner__link">Privacy notice</a>. You may accept or reject them.</p>' +
			'<div class="cookie-consent-banner__actions">' +
			'<button type="button" class="cookie-consent-banner__btn" data-cookie-action="reject">Reject</button>' +
			'<button type="button" class="cookie-consent-banner__btn cookie-consent-banner__btn--accept" data-cookie-action="accept">Accept</button>' +
			'</div></div>';
		document.body.appendChild(el);
		el.querySelector('[data-cookie-action="accept"]').addEventListener('click', function () {
			setPreferenceCookie(CONSENT_ACCEPT);
			loadGoogleAnalytics();
			el.remove();
		});
		el.querySelector('[data-cookie-action="reject"]').addEventListener('click', function () {
			setPreferenceCookie(CONSENT_REJECT);
			el.remove();
		});
	}

	const pref = consentFromCookie();
	if (pref === CONSENT_ACCEPT) {
		loadGoogleAnalytics();
	} else if (pref === CONSENT_REJECT) {
		/* stored decline, no analytics */
	} else if (document.body) {
		showBanner();
	} else {
		document.addEventListener('DOMContentLoaded', showBanner);
	}
})();
