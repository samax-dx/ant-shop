//import { Machine, interpret, send, sendParent } from 'xstate';
const {machine,assign, Machine, interpret,send,sendParent,actions,
    spawn}=require('xstate')

const queryMachine=Machine({
    id:'query',
    initial:'noQuery',
    context: {
        query:{
            countryName: '',
        }},
    states:{
        noQuery:{
            //entry: [(context,event)=>{console.log('hello from entry');}],
            on:{
                QUERY_CHANGED:{
                    target:'hasQuery',
                    cond:'searchNotEmpty',
                    actions:['setQuery']
                }
            }
        },
        hasQuery: {},
        loading:{}
    },
    guards:{
        searchNotEmpty:(context,e)=>
            Object.values(context.query).filter(v=>v).length>0
    },
    actions:{
        setQuery:assign((context,e)=> {
            let query=context.query;
            query[e.param]=e.value;
            return query;
        })
    }
});

const countryMachine = Machine({
    id: 'country',
    initial: 'init',
    context: {
        queryRef: {},
        resultRef: {},
    },
    states:{
        init: {
            on:{
                entry:{},
                LOAD:{
                    target: 'loading',
                    actions:[assign({
                        queryRef:()=>spawn(queryMachine,{autoForward:true})
                    }),()=>console.log('Spawning actions...')]
                }
            },
			after:{
            	2000: 'loading'
			}
        },
        loading: {},
        fetched:{},
        error:{}
    }
});

// const service = interpret(countryMachine);
exports.countryMachine=countryMachine;

