import React, { createContext, useContext, useState, useReducer } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

const initialState = {
    step: 1,
    bio: {
        title: 'Mr',
        name: '',
        dob: '',
        nic: '',
        phone: '',
        address: '',
        civilStatus: 'Unmarried',
        spouse: { name: '', nic: '', dob: '' }
    },
    membership: {
        joinedDate: '',
        membershipNo: '',
        zone: '',
        positions: [] // { id, title, yearAppointed, yearResigned }
    },
    pastBenefits: [], // { id, deceasedName, relationship, yearDeath, amount }
    otherBenefits: [], // { id, description, year, amount }
    lifeMember: {
        isLifeMember: false,
        eligibilityDate: ''
    },
    nominees: [] // { id, name, relationship, address, share }
};

function formReducer(state, action) {
    switch (action.type) {
        case 'NEXT_STEP':
            return { ...state, step: state.step + 1 };
        case 'PREV_STEP':
            return { ...state, step: state.step - 1 };
        case 'UPDATE_BIO':
            return { ...state, bio: { ...state.bio, ...action.payload } };
        case 'UPDATE_MEMBERSHIP':
            return { ...state, membership: { ...state.membership, ...action.payload } };
        case 'ADD_POSITION':
            return {
                ...state,
                membership: {
                    ...state.membership,
                    positions: [...state.membership.positions, action.payload]
                }
            };
        case 'REMOVE_POSITION':
            return {
                ...state,
                membership: {
                    ...state.membership,
                    positions: state.membership.positions.filter((_, i) => i !== action.payload)
                }
            };
        case 'ADD_PAST_BENEFIT':
            return { ...state, pastBenefits: [...state.pastBenefits, action.payload] };
        case 'REMOVE_PAST_BENEFIT':
            return { ...state, pastBenefits: state.pastBenefits.filter((_, i) => i !== action.payload) };
        case 'ADD_OTHER_BENEFIT':
            return { ...state, otherBenefits: [...state.otherBenefits, action.payload] };
        case 'REMOVE_OTHER_BENEFIT':
            return { ...state, otherBenefits: state.otherBenefits.filter((_, i) => i !== action.payload) };
        case 'UPDATE_LIFE_MEMBER':
            return { ...state, lifeMember: { ...state.lifeMember, ...action.payload } };
        case 'ADD_NOMINEE':
            return { ...state, nominees: [...state.nominees, action.payload] };
        case 'REMOVE_NOMINEE':
            return { ...state, nominees: state.nominees.filter((_, i) => i !== action.payload) };
        case 'RESET_FORM':
            return initialState;
        default:
            return state;
    }
}

export const FormProvider = ({ children }) => {
    const [state, dispatch] = useReducer(formReducer, initialState);

    return (
        <FormContext.Provider value={{ state, dispatch }}>
            {children}
        </FormContext.Provider>
    );
};
