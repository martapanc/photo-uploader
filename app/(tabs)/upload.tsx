import Ionicons from '@expo/vector-icons/Ionicons';
import {Button, Image, StyleSheet, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useState} from "react";

export default function UploadScreen() {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<string>('');

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access files required');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }
    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage}/>}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Upload</ThemedText>

                <ThemedView style={styles.formContainer}>
                    <TextInput
                        placeholder="Photo Title"
                        value={title}
                        onChangeText={setTitle}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={[styles.input, styles.descriptionInput]}
                        multiline
                    />

                    <Button title={'Pick a photo'} onPress={pickImage} />
                    {image && <Image source={{ uri: image }} style={styles.image} />}
                </ThemedView>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        padding: 20,
    },
    formContainer: {
        marginTop: 20,
        gap: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
    },
    descriptionInput: {
        height: 100,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
    headerImage: {
        alignSelf: 'center',
    },
});
