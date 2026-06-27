# Mobile Scaling Investigation: Simplifi AI

## 1. Technical Strategy
We will use **Capacitor** as the mobile wrapper for the existing React/Vite web application. This allows us to maintain a single codebase while gaining access to native device features.

## 2. Mobile-Specific Hurdles & Mitigation

### A. Push Notifications (Critical for Engagement)
- **Problem:** Web push notifications have limited support on iOS (requires PWA + Home Screen). Scaling to thousands of users requires reliable native push.
- **Solution:** Use `@capacitor/push-notifications`. 
- **Scale Impact:** Integrating with Firebase Cloud Messaging (FCM) for Android and APNs for iOS.
- **Implementation:** 
    1. Install `@capacitor/push-notifications`.
    2. Register the device token on user login.
    3. Backend updates to trigger FCM/APNs alerts when automations complete (e.g., "Grocery Restock Complete").

### B. Background Sync (Mental Load Automation)
- **Problem:** Mobile operating systems aggressively kill background processes to save battery. Our "Invisible Assistant" needs to sync calendars even when the app is closed.
- **Solution:** 
    - Keep the core logic on the **Backend (Server-side cron)**.
    - Use **Capacitor Background Task** or **Background Runner** for light client-side sync if needed.
    - **Optimization:** Trigger server-side sync via silent push notifications (data-only) to wake the app or signal the server.

### C. OAuth 2.0 Flow (Google, Kroger, Splitwise)
- **Problem:** Standard browser redirects `http://localhost:3001/auth/callback` won't work inside a native mobile app view.
- **Solution:** 
    - Use **Deep Linking** (e.g., `simplifiai://auth-callback`).
    - Use `@capacitor/browser` for the OAuth handshake to ensure a secure, system-level browser experience rather than an In-App WebView (which Google often blocks).

### D. Secure Storage (User Privacy)
- **Problem:** LocalStorage is not encrypted and can be cleared by the OS.
- **Solution:** Use `@capacitor-community/secure-storage` for sensitive data like refresh tokens (if stored client-side) or session IDs.

## 3. Prototype Roadmap
1. [x] Install Capacitor Core and CLI.
2. [x] Initialize Android project.
3. [ ] Configure Deep Linking in `capacitor.config.ts`.
4. [ ] Install and configure Push Notification plugin.
5. [ ] Refactor Login flow to handle deep link redirects.

## 4. Scaling Considerations (Thousands of Users)
- **Infrastructure:** Load balance the backend server as mobile traffic increases.
- **Data Usage:** Minimize payload sizes for mobile users on cellular data.
- **Testing:** Use an automated mobile testing suite (like Appium or Maestro) to ensure parity across iOS/Android versions.
