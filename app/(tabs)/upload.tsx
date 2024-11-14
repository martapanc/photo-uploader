import Ionicons from '@expo/vector-icons/Ionicons';
import {Button, Image, StyleSheet, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useState} from "react";
import {cloudinary} from "@/constants/config";

export default function UploadScreen() {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

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
            alert(JSON.stringify(result.assets[0]));
        }
    }

    const handleUpload = async () => {
        if (!title || !description || !image) {
            alert('Please fill in all fields');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('file', {
            uri: image,
            type: 'image/jpeg',
            name: `${title}.webp`
        } as any);
        formData.append('upload_preset', 'Convert to Webp');
        formData.append('folder', 'Food');
        formData.append('context', `caption=${title}|alt=${description}`);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.cloud_name}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                },
            )

            const data = await response.json();

            if (data.error) {
                alert('Upload failed: ' + data.error.message);
            } else {
                alert('Upload successful!');
            }
        } catch (error) {

        } finally {
            setUploading(false);
        }
    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage}/>}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Upload</ThemedText>

                <ThemedView style={styles.formContainer}>
                    <Button title={'Pick a photo'} onPress={pickImage} />
                    {image && <Image source={{ uri: image }} style={styles.image} />}

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

                    <Button title={uploading ? 'Uploading...' : 'Upload'} onPress={handleUpload} />
                </ThemedView>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        padding: 4,
    },
    formContainer: {
        marginTop: 10,
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
        width: 300,
        height: 200,
        marginTop: 2,
        alignSelf: 'center'
    },
    headerImage: {
        alignSelf: 'center',
    },
});
