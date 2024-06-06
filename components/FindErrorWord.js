function highlightError({ input, output }) {
    const result = [];

    /* Split the text */
    const inputWords = input.split(' ');
    const outputWords = output.split(' ');

    /* Word length */
    const inputLen = inputWords.length;
    const outputLen = outputWords.length;

    let inputWordIndex = 0;
    let outputWordIndex = 0;
    while (inputWordIndex < inputLen || outputWordIndex < outputLen) {
        /* Get current word */
        const curInputWord =
            inputWordIndex < inputLen
                ? inputWords[inputWordIndex]
                : undefined;
        const curOutputWord =
            outputWordIndex < outputLen
                ? outputWords[outputWordIndex]
                : undefined;

        /* Same then continue to next word */
        if (curInputWord === curOutputWord) {
            result.push({
                phrase: curInputWord,
                suggestion: '',
                isError: false,
            });

            inputWordIndex++;
            outputWordIndex++;

            continue;
        }

        /* Current input word is
            the last then replace
            the rest of output with current input word
        */
        if (inputWordIndex + 1 == inputLen) {
            result.push({
                phrase: curInputWord,
                suggestion: outputWords
                    .slice(outputWordIndex, outputLen)
                    .join(' '),
                isError: true,
            });

            break;
        }

        /* Current output word is
            the last then replace
            the rest of input with current output word
        */
        if (outputWordIndex + 1 == outputLen) {
            result.push({
                phrase: inputWords
                    .slice(inputWordIndex, inputLen)
                    .join(' '),
                suggestion: curOutputWord,
                isError: true,
            });

            break;
        }

        const { newInputWordIndex, newOutputWordIndex, diff } =
            findErrorPhrase({
                inputWords,
                outputWords,
                inputWordIndex,
                outputWordIndex,
            });

        if (diff) {
            result.push({
                phrase: inputWords
                    .slice(inputWordIndex, newInputWordIndex)
                    .join(' '),
                suggestion: diff,
                isError: true,
            });

            inputWordIndex = newInputWordIndex;
            outputWordIndex = newOutputWordIndex;

            continue;
        }

        result.push({
            phrase: curInputWord,
            suggestion: curOutputWord,
            isError: false,
        });

        inputWordIndex++;
        outputWordIndex++;
    }

    return result;
}

function findErrorPhrase({
    inputWords = [],
    outputWords = [],
    inputWordIndex,
    outputWordIndex,
}) {
    let diff = [];
    let newInputWordIndex = inputWordIndex;
    let newOutputWordIndex = outputWordIndex;

    while (newInputWordIndex + 1 < inputWords.length) {
        const nextInputWord = inputWords[newInputWordIndex + 1];
        const firtMatchOutputWordIndex = outputWords.indexOf(
            nextInputWord,
            newOutputWordIndex + 1
        );

        newInputWordIndex++;

        if (firtMatchOutputWordIndex >= 0) {
            diff = outputWords.slice(
                outputWordIndex,
                firtMatchOutputWordIndex + 1
            );

            newOutputWordIndex = firtMatchOutputWordIndex;

            break;
        }
    }

    return {
        newInputWordIndex: newInputWordIndex + 1,
        newOutputWordIndex: newOutputWordIndex + 1,
        diff: diff.join(' '),
    };
}

export default highlightError;
