import { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, setDoc } from 'firebase/firestore';

export function useFirestore(collectionName) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDocuments = async (conditions = []) => {
        setLoading(true);
        try {
            let q = collection(db, collectionName);
            if (conditions.length > 0) {
                // simple conditions: [{field: 'status', operator: '==', value: 'active'}]
                q = query(q, ...conditions.map(c => where(c.field, c.operator, c.value)));
            }
            const querySnapshot = await getDocs(q);
            const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLoading(false);
            return documents;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return [];
        }
    };

    const addDocument = async (data, customId = null) => {
        setLoading(true);
        try {
            if (customId) {
                await setDoc(doc(db, collectionName, customId), data);
                setLoading(false);
                return customId;
            } else {
                const docRef = await addDoc(collection(db, collectionName), data);
                setLoading(false);
                return docRef.id;
            }
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return null;
        }
    };

    const updateDocument = async (id, data) => {
        setLoading(true);
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, data);
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    };

    const deleteDocument = async (id) => {
        setLoading(true);
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    };

    return { getDocuments, addDocument, updateDocument, deleteDocument, loading, error };
}
