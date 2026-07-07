import Script from "next/script";

export default function PopunderAd() {
  return (
    <Script id="popunder-ad" strategy="afterInteractive">
      {`(function(s){s.dataset.zone='11253647',s.src='https://llvpn.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
    </Script>
  );
}
