<script>
    import Router from 'svelte-spa-router';
    import Landing from './pages/Landing.svelte';
    import Login from './pages/Login.svelte';
    import Dashboard from './pages/Dashboard.svelte';
    import Chat from './pages/Chat.svelte';
    import Komunitas from './pages/Komunitas.svelte';
    import Kuesioner from './pages/Kuesioner.svelte';

    const routes = {
        '/': Landing,
        '/login': Login,
        '/dashboard': Dashboard,
        '/chat': Chat,
        '/komunitas': Komunitas,
        '/kuesioner': Kuesioner
    };
</script>

<Router {routes} />
