// src/components/admin/users/delete-user-dialog.tsx
"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { deleteUser, type ActionState } from "@/lib/actions/user-actions"

// Tipagem das props que o componente espera receber
interface DeleteUserDialogProps {
    open: boolean       // Define se o Dialog está visível ou não
    onOpenChange: (open: boolean) => void       // Função para abrir ou fechar o Dialog
    userId: string | null       // ID do utilizador a eliminar (null se não selecionado)
}

// Estado inicial da ação (nenhum erro, nenhum sucesso ainda)
const initialState: ActionState = {}

export function DeleteUserDialog({ open, onOpenChange, userId }: DeleteUserDialogProps) {

    // useActionState gere o estado do processo de eliminação
    // state = estado atual (erros, sucesso, etc)
    // formAction = função que será atribuída ao action do form
    // isPending = booleano que indica se o pedido está a ser processado
    const [state, formAction, isPending] = useActionState(deleteUser, initialState)

    // useEffect para fechar automaticamente o Dialog se a eliminação for bem sucedida
    useEffect(() => {
        if (state.success) {
            onOpenChange(false)     // Fecha o Dialog
        }
    }, [state.success, onOpenChange])

    // Se não houver utilizador selecionado, o componente não renderiza nada
    if (!userId) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border border-white/10">
                {/* Cabeçalho do Diálogo */}
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Are you sure you want to delete this user? This action cannot be undone and may affect existing
                        subscriptions.
                    </DialogDescription>
                </DialogHeader>

                {/* Formulário responsável por submeter o pedido de eliminação */}
                <form action={formAction}>
                    {/* Campo escondido com o ID do utilizador a eliminar */}
                    <input type="hidden" name="userId" value={userId} />

                    {/* Alerta de erro caso a eliminação falhe */}
                    {state.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Área dos botões do diálogo */}
                    <DialogFooter className="gap-2">
                        {/* Botão para cancelar e fechar o diálogo */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-white/20 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        {/* Botão de confirmação de eliminação */}
                        <Button type="submit" variant="destructive" disabled={isPending} className="bg-red-600 hover:bg-red-700">
                            {/* Ícone de loading aparece durante o processamento */}
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete User
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}