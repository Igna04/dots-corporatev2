import React, { FC } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "../../theme/KalenderStyles";

const TaskStatusFilter: FC<{ selectedStatus: string, setSelectedStatus: (status: string) => void }> = ({ selectedStatus, setSelectedStatus }) => {
    return (
        <View style={styles.statusContainer}>
            {["All", "To Do", "In Progress", "Finished"].map((status) => (
                <TouchableOpacity key={status} style={[styles.statusButton, selectedStatus === status && styles.selectedButton]} onPress={() => setSelectedStatus(status)}>
                    <Text style={styles.statusText}>{status}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
export default TaskStatusFilter;
