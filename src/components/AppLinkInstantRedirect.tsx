import {
  buildAndroidIntentUrl,
  buildCustomSchemeUrl,
  type OpenInAppTarget,
} from '@/lib/mobileAppLinks';

/**
 * Inline script runs before React hydrates. Skips in-app browsers (WhatsApp) where
 * auto-redirect is blocked — OpenInAppGate shows a tap button instead.
 */
export default function AppLinkInstantRedirect({ target }: { target: OpenInAppTarget }) {
  const appUrl = buildCustomSchemeUrl(target);
  // Custom-scheme (ofside://) intent opens the installed app without needing App Links
  // verification; the https-scheme intent falls back to the Play Store when unverified.
  const androidIntent = buildAndroidIntentUrl(target);

  const script = `(function(){
  var ua=navigator.userAgent||'';
  var isIos=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  var isAndroid=/Android/i.test(ua);
  var inApp=/WhatsApp|Instagram|FBAN|FBAV|Twitter|Line\\/|Snapchat|TikTok|LinkedInApp|Telegram|Messenger/i.test(ua);
  if(!isIos&&!isAndroid||inApp)return;
  try{
    if(isAndroid)window.location.replace(${JSON.stringify(androidIntent)});
    else window.location.href=${JSON.stringify(appUrl)};
  }catch(e){}
})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
