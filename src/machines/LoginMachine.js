import { assign, createMachine } from "xstate";

const doLogin=()=> new Promise((resolve, reject)=> {
    setTimeout(()=>resolve({name: "Mustafa"})
        ,1000)
})

export const loginMachine = createMachine({
    context: {
        result: null,
        error: null,
    },
    initial: "idle",
    states: {
        idle: {
            on: {
                "LOAD": { target: "fetching" },
            }
        },
        fetching: {
            invoke: {
                id: 'promiseTest',
                src: ()=>doLogin(),
                // onDone: { target: "hasResult", actions: ["setResult","printResult"] },
                onDone: { target: "hasResult",
                            actions:assign((context,event)=>{
                                console.log('hello event='+JSON.stringify(event.data));
                                return {
                                    result: event.data
                                };
                            })
                },
                onError: { target: "hasError",
                }
            }
        },
        hasResult: {
            entry:[
                (context)=>{console.log("context="+JSON.stringify(context))},
            ],
            on: {

                "LOAD": { target: "fetching" },
            }
        },
        hasError: {
            on: {
                "LOAD": { target: "fetching" },
            }
        }
    },
});
