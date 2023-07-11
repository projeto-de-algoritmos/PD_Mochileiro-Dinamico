import { useState } from "react";
import { Avatar, Button, DataTable, Dialog, FAB, IconButton, Modal, Portal, Text, TextInput } from "react-native-paper";
import { Image, ScrollView } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import * as Produto from "../Produto/Produto"
import { styles, ListBox, Mochila, Mochila_2 } from "./Styles";

export default function Home() {
    const [capacidadeDaMochila, setCapacidadeDaMochila] = useState("")
    const [x, setX] = useState(350)
    const [y, setY] = useState(300)
    const [exibeResultado, setExibeResultado] = useState(false)
    const [exibeAlertaLista, setExibeAlertaLista] = useState(false)
    const [exibeAlertaMochila, setExibeAlertaMochila] = useState(false)
    const [editaLista, setEditaLista] = useState(false)
    const [valorTotal, setValorTotal] = useState(0)
    const [adicionarVisivel, setAdicionarVisivel] = useState(false)
    const [selecionado, setSelecionado] = useState("")
    const [adicionarPeso, setAdicionarPeso] = useState("")
    const [adicionarValor, setAdicionarValor] = useState("")
    /**
     * Produtos adicionados à mochila
     * @type {[{produto: String, peso: Number, valor: Number, icone: String}[]]}
     */
    const [produtos, setProdutos] = useState([])

    /**
     * Produtos presentes na lista de produtos
     * @type {[{produto: String, peso: Number, valor: Number, icone: String}[]]}
     */
    const [lista, setLista] = useState([
        {
            produto: "Celuar",
            peso: 1,
            valor: 1,
            icone: Produto.Celular
        },
        {
            produto: "Notebook",
            peso: 2,
            valor: 6,
            icone: Produto.Notebook
        },
        {
            produto: "Arco",
            peso: 5,
            valor: 18,
            icone: Produto.Arco
        },
        {
            produto: "Katana",
            peso: 6,
            valor: 22,
            icone: Produto.Katana
        },
        {
            produto: "Telescopio",
            peso: 7,
            valor: 28,
            icone: Produto.Telescopio
        },
    ])

    let memoization

    const dados = [
        {key:'0', value:'Arco', icon: Produto.Arco},
        {key:'1', value:'Bicicleta', icon: Produto.Bicicleta},
        {key:'2', value:'Celular', icon: Produto.Celular},
        {key:'3', value:'Katana', icon: Produto.Katana},
        {key:'4', value:'Notebook', icon: Produto.Notebook},
        {key:'5', value:'Telescopio', icon: Produto.Telescopio},
        {key:'6', value:'Violino', icon: Produto.Violino},
    ]

    /**
     * Algoritmo da Mochila (Knapsack)
     */
    const calculaResultado = () => {
        if (lista.length == 0) {
            setExibeAlertaLista(true)
            setX(350)
            setY(300)
            return
        }

        if(capacidadeDaMochila == "" || capacidadeDaMochila == 0) {
            setExibeAlertaMochila(true)
            setX(350)
            setY(300)
            return
        }

        let linhas = lista.length // Quantidade de produtos
        let colunas = Number(capacidadeDaMochila) // Quantidade de pesos

        memoization = new Array(linhas+1)

        for (let i = 0; i <= linhas; i++) {
            memoization[i] = new Array(colunas+1)    
        }
        
        setX(350)
        setY(300)

        setValorTotal(knapsack(linhas, colunas))
        findSolution(linhas, colunas)

        setExibeResultado(true)
    }

    /**
     * Algoritmo recursivo da mochila
     * @param {Number} i - Quantidade de produtos
     * @param {Number} w - Peso restante na mochila
     * @returns {Number} Maior valor 
     */
    const knapsack = (i, w) => {
        if (i == 0) {
            return 0
        }

        if (lista[i-1].peso > w) {
            return knapsack(i-1, w)
        }
        if (memoization[i][w] == undefined) {
            memoization[i][w] = Math.max(lista[i-1].valor+knapsack(i-1, w-lista[i-1].peso), knapsack(i-1, w))
        }
        return memoization[i][w]
    }

    /**
     * Adiciona os produtos na mochila
     * @param {Number} i - Quantidade de produtos
     * @param {Number} w - Peso restante na mochila
     */
    const findSolution = (i, w) => {
        
        while (i>0 || w>0) {
            if (memoization[i][w] == memoization[i-1][w]) {
                i--
            } else {
                i--
                w -= lista[i-1].peso
            }
        }
    }

    /**
     * Adiciona produto à lista de produtos
     */
    const adicionarProduto = () => {
        const novoProduto = {
            produto: dados[selecionado].value,
            peso: Number(adicionarPeso),
            valor: Number(adicionarValor),
            icone: dados[selecionado].icon
        }

        setLista([...lista, novoProduto])

        setAdicionarVisivel(false)
        setAdicionarPeso("")
        setAdicionarValor("")
        setSelecionado("")
    }

    return (
        <>
            <Portal>
                {/**
                 * Modal que exibe o resultado do Algoritmo da Mochila.
                 */}
                <Modal
                    visible={exibeResultado}
                    onDismiss={() => setExibeResultado(false)}
                    contentContainerStyle={styles.modal}
                >
                    <IconButton
                        icon="close"
                        onPress={() => {
                            setExibeResultado(false)
                            setProdutos([])
                            setValorTotal(0)
                        }}
                        style={styles.botaoX}
                    />

                    <Text
                        style={styles.texto}
                    >Valor Total: {valorTotal}</Text>

                    <DataTable style={{ height: 450 }}>
                        <DataTable.Header>
                            <DataTable.Title />
                            <DataTable.Title>Produto</DataTable.Title>
                            <DataTable.Title numeric>Peso (kg)</DataTable.Title>
                            <DataTable.Title numeric>Valor</DataTable.Title>
                        </DataTable.Header>

                        <ScrollView>
                            {produtos.length > 0 && produtos.map((produto, index) => {
                                return (
                                    <DataTable.Row key={index}>
                                        <DataTable.Cell  style={{width: 20}}>
                                            <Avatar.Image
                                                source={produto.icone}
                                                size={40}
                                                style={{backgroundColor: 'transparent'}}
                                            />
                                        </DataTable.Cell>
                                        <DataTable.Cell>{produto.produto}</DataTable.Cell>
                                        <DataTable.Cell numeric>{produto.peso}</DataTable.Cell>
                                        <DataTable.Cell numeric>{produto.valor}</DataTable.Cell>
                                    </DataTable.Row>
                                )
                            })}
                        </ScrollView>
                    </DataTable>
                </Modal>

                {/**
                 * Modal que exibe todos os produtos da lista.
                 */}
                <Modal
                    visible={editaLista}
                    onDismiss={() => setEditaLista(false)}
                    contentContainerStyle={styles.modal}
                >
                    <IconButton
                        icon="close"
                        onPress={() => setEditaLista(false)}
                        style={styles.botaoX}
                    />
                    
                    <DataTable style={{ height: 500 }}>
                        <DataTable.Header>
                            <DataTable.Title />
                            <DataTable.Title>Produto</DataTable.Title>
                            <DataTable.Title numeric>Peso (kg)</DataTable.Title>
                            <DataTable.Title numeric>Valor</DataTable.Title>
                        </DataTable.Header>

                        <ScrollView>
                            {lista.length > 0 && lista.map((produto, index) => {
                                return (
                                    <DataTable.Row key={index}>
                                        <DataTable.Cell  style={{width: 20}}>
                                            <Avatar.Image
                                                source={produto.icone}
                                                size={40}
                                                style={{backgroundColor: 'transparent'}}
                                            />
                                        </DataTable.Cell>
                                        <DataTable.Cell>{produto.produto}</DataTable.Cell>
                                        <DataTable.Cell numeric>{produto.peso}</DataTable.Cell>
                                        <DataTable.Cell numeric>{produto.valor}</DataTable.Cell>
                                    </DataTable.Row>
                                )
                            })}
                        </ScrollView>
                    </DataTable>

                    <Button
                        mode="elevated"
                        icon="plus"
                        style={styles.botaoAdicionar}
                        onPress={() => setAdicionarVisivel(true)}
                        labelStyle={{color: "deepskyblue"}}
                    >Adicionar</Button>
                </Modal>

                {/**
                 * Modal que exibe a janela de adição de produtos.
                 */}
                <Modal
                    visible={adicionarVisivel}
                    onDismiss={() => {
                        setAdicionarVisivel(false)
                        setAdicionarPeso("")
                        setAdicionarValor("")
                        setSelecionado("")
                    }}
                    contentContainerStyle={{
                        ...styles.modal,
                        height: 400,
                        width: '80%',
                        justifyContent: 'flex-start',
                        paddingHorizontal: 20,
                        paddingVertical: 60,
                    }}
                >
                    <Button
                        mode="elevated"
                        icon="plus"
                        disabled={adicionarPeso == "" || adicionarValor == "" || selecionado == "" || adicionarPeso == 0 || adicionarValor == 0}
                        style={styles.botaoAdicionar}
                        onPress={() => adicionarProduto()}
                        labelStyle={{
                            color: adicionarPeso == "" || adicionarValor == "" || selecionado == "" || adicionarPeso == 0 || adicionarValor == 0 ? "gray" : "deepskyblue"
                        }}
                    >Adicionar</Button>
                    
                    <TextInput
                        mode="outlined"
                        value={adicionarPeso}
                        label="Peso (kg)"
                        keyboardType="numeric"
                        style={{
                            position: 'absolute',
                            top: 150,
                            width: '100%',
                            alignSelf: 'center',
                            backgroundColor: 'white',
                        }}
                        outlineStyle={{ borderRadius: 10 }}
                        onChangeText={peso => setAdicionarPeso(peso.replace(/[^0-9]/g, ''))}
                    />

                    <TextInput
                        mode="outlined"
                        value={adicionarValor}
                        label="Valor"
                        keyboardType="numeric"
                        style={{
                            position: 'absolute',
                            top: 250,
                            width: '100%',
                            alignSelf: 'center',
                            backgroundColor: 'white',
                        }}
                        outlineStyle={{ borderRadius: 10 }}
                        onChangeText={valor => setAdicionarValor(valor.replace(/[^0-9]/g, ''))}
                    />

                    <SelectList
                        setSelected={(produto) => setSelecionado(produto)}
                        data={dados}
                        save="key"
                        placeholder="Selecione um produto"
                        dropdownStyles={{ backgroundColor: 'white'}}
                        searchPlaceholder="Pesquisar"
                    />

                </Modal>

                <Dialog visible={exibeAlertaLista} onDismiss={() => setExibeAlertaLista(false)}>
                    <Dialog.Title>Atenção!</Dialog.Title>

                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            A lista está vazia! Adicione produtos à
                            lista antes de movê-la para a mochila.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            labelStyle={{color: "deepskyblue"}}
                            onPress={() => setExibeAlertaLista(false)}
                        >Ok</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={exibeAlertaMochila} onDismiss={() => setExibeAlertaMochila(false)}>
                    <Dialog.Title>Atenção!</Dialog.Title>

                    <Dialog.Content>
                        <Text variant="bodyMedium">
                            Defina a capacidade da mochila.
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button
                            labelStyle={{color: "deepskyblue"}}
                            onPress={() => setExibeAlertaMochila(false)}
                        >Ok</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <TextInput
                label="Capacidade da mochila"
                value={capacidadeDaMochila}
                cursorColor="white"
                activeOutlineColor="white"
                textColor="white"
                outlineColor="white"
                selectionColor="rgba(255,255,255,0.5)"
                placeholderTextColor="white"
                onChangeText={text => setCapacidadeDaMochila(text.replace(/[^0-9]/g, ''))}
                right={<TextInput.Affix text="kg" textStyle={{color: 'white'}}/>}
                keyboardType="numeric"
                style={{
                    position: "absolute",
                    width: 250,
                    fontSize: 12,
                    top: 80,
                    backgroundColor: 'transparent',
                    textAlignVertical: "bottom"
                }}
                mode="outlined"
                outlineStyle={{
                    borderStyle: "dashed",
                    top: 15,
                    bottom: 5,
                }}
            />

            <FAB
                visible={y < 680 ? true : false}
                icon={ListBox}
                onPress={() => setEditaLista(true)}
                style={{
                    ...styles.fab,
                    left: x-20,
                    top: y-20,
                }}
                color="deepskyblue"
                onTouchMove={(e) => {
                    setX(e.nativeEvent.pageX)
                    setY(e.nativeEvent.pageY)
                }}
                onTouchEnd={() => {
                    if(y >= 680) {
                        calculaResultado()
                    }
                }}
            />

            <Image
                style={{
                    ...styles.imagem,
                    zIndex: 0,
                    height: 454
                }}
                source={Mochila}
            />
            <Image
                style={{
                    ...styles.imagem,
                    zIndex: 20,
                    height:297
                }}
                source={Mochila_2}
            />
        </>
    )
}
