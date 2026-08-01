const Session = (() => {

    const KEY = "ark_session_id";

    function generateId() {

        return crypto.randomUUID();

    }

    function getSessionId() {

        let id = localStorage.getItem(KEY);

        if (!id) {

            id = generateId();

            localStorage.setItem(KEY, id);

        }

        return id;

    }

    function newSession() {

        const id = generateId();

        localStorage.setItem(KEY, id);

        return id;

    }

    return {

        getSessionId,
        newSession

    };

})();