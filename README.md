# yarn config get registry 문제 해결
- yarn add -D patch-package postinstall-postinstall
- 페키지 제이슨 "scripts": { "postinstall": "patch-package" } 