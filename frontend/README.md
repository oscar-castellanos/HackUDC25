# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Run with docker

Let's assume you need sudo to run docker commands.

Also you have the conda env hackUDC25 that u can activate to run locally.

### Dev environment

Let's assume u are in the `frontend/` folder.

- Build 
  ```bash
  sudo docker build -f Dockerfile.front.dev -t my_front .
  ```

- Run
  ```bash
  sudo docker run -d -it --rm -p 8080:8080 --name frontendHack  my_front
  ```

- Stop (Stops all running containers)
  ```bash
  sudo docker stop $(sudo docker ps -a -q)
  ```

## Run full set-up

From the root folder, run the following commands to rebuild the services:

```bash
sudo docker compose up -d --build frontend backend
```

And take it down with the following command:

```bash
sudo docker compose down
```
