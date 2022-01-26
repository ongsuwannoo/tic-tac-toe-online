# Tic Tac Toe Online

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

Prepare **Firebase project.** [Documentation](https://docs.kii.com/en/samples/push-notifications/push-notifications-android-fcm/create-project/)

### Installation

1. Get config object for your web app from **Firebase project.** [Documentation](https://support.google.com/firebase/answer/7015592)
2. Edit `firebaseConfig` in `config.js`
   ```js
    const firebaseConfig = {
        apiKey: "...",
        authDomain: "...",
        databaseURL: "...",
        projectId: "...",
        storageBucket: "...",
        messagingSenderId: "...",
        appId: "..."
    };
   ```
3. Open file `index.html`