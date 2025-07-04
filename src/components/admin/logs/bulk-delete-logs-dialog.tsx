// src/components/admin/logs/bulk-delete-logs-dialog.tsx
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

import { bulkDeleteLogsByIds, type ActionState } from "@/lib/actions/log-actions"

// Interface para as props do componente
interface BulkDeleteLogsDialogProps {
    open: boolean       // Controla se o diálogo está aberto
    onOpenChange: (open: boolean) => void       // Callback para mudar o estado
    selectedIds?: string[]      // IDs dos logs selecionados
    onLogsDeleted?: () => Promise<void>     // Callback após exclusão bem-sucedida
}

// Estado inicial para a ação
const initialState: ActionState = {}

export function BulkDeleteLogsDialog({
    open,
    onOpenChange,
    selectedIds = [],
    onLogsDeleted,
}: BulkDeleteLogsDialogProps) {
    // Gerencia o estado da ação de exclusão
    const [state, formAction, isPending] = useActionState(bulkDeleteLogsByIds, initialState)

    // Lida com exclusão bem sucedida
    useEffect(() => {
        if (state.success) {
            onLogsDeleted?.()       // Executa o callback se fornecido
            onOpenChange(false)     // Fecha o dialog
        }
    }, [state.success, onLogsDeleted, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-[#1a1a1a] border border-white/10">
                {/* Cabeçalho do diálogo */}
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Bulk Delete Logs</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Delete multiple selected log entries. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {/* Formulário para envio dos IDs */}
                <form action={formAction}>
                    {/* Input oculto contendo os IDs em formato JSON */}
                    <input type="hidden" name="ids" value={JSON.stringify(selectedIds)} />

                    {/* Exibe erros se houver */}
                    {state.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Área de resumo da operação */}
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-lg p-4 mb-4">
                        <p className="text-white/80 text-sm">
                            You are about to delete <span className="font-semibold text-[#66b497]">{selectedIds.length}</span>{" "}
                            selected log entries.
                        </p>
                        {/* Lista os primeiros 5 IDs (para preview) */}
                        {selectedIds.length > 0 && (
                            <div className="mt-2 max-h-32 overflow-y-auto">
                                <p className="text-xs text-white/60 mb-1">Selected IDs:</p>
                                <div className="text-xs text-white/50 font-mono">
                                    {selectedIds.slice(0, 5).map((id, index) => (
                                        <div key={id}>
                                            {index + 1}. {id}
                                        </div>
                                    ))}
                                    {selectedIds.length > 5 && <div>... and {selectedIds.length - 5} more</div>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rodapé do diálogo com botões de ação */}
                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isPending || selectedIds.length === 0}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Selected ({selectedIds.length})
                        </Button>
                    </DialogFooter>
                </form>

                {/* Mensagem de sucesso após exclusão */}
                {state.success && (
                    <Alert className="border-green-500/20 bg-green-500/10 mt-4">
                        <AlertDescription className="text-green-400">
                            Successfully deleted {state.deletedCount || 0} log entries.
                        </AlertDescription>
                    </Alert>
                )}
            </DialogContent>
        </Dialog>
    )
}